import { Plugin, Dialog } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-smoothcaret";
const CONFIG_EASE_KEY = "asri-enhance-smoothcaret-ease";
const CONFIG_MOTION_KEY = "asri-enhance-smoothcaret-motion";
const CONFIG_STYLE_KEY = "asri-enhance-smoothcaret-style";
const CARET_ITEM_ID = "asri-enhance-smooth-caret-item";
type EaseType = "elegant" | "shuttle" | "drift" | "spring";
type MotionType = "static" | "breathing" | "stretch";
type StyleType = "default" | "neon" | "rainbow" | "block" | "underline";
const MOTION_CLASSES = [
    "asri-enhance-smooth-caret-motion-static",
    "asri-enhance-smooth-caret-motion-breathing",
    "asri-enhance-smooth-caret-motion-stretch",
] as const;
const STYLE_CLASSES = [
    "asri-enhance-smooth-caret-style-default",
    "asri-enhance-smooth-caret-style-neon",
    "asri-enhance-smooth-caret-style-rainbow",
    "asri-enhance-smooth-caret-style-block",
    "asri-enhance-smooth-caret-style-underline",
] as const;
const EASE_MAP: Record<EaseType, string> = {
    elegant: "0.75s cubic-bezier(0.1, 0.9, 0.2, 1)",
    shuttle: "0.15s cubic-bezier(0, 0, 0.1, 1)",
    drift: "0.15s cubic-bezier(0.7, 0, 1, 1)",
    spring: "0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
};
let smoothCaretEventHandler: (() => void) | null = null;
let throttledCaretEventHandler: (() => void) | null = null;
let throttleTimers: number[] = [];
let cachedZIndex = 0;
let lastTargetElement: Element | null = null;
let cachedScrollContainer: HTMLElement | null = null;
let cachedFocusElement: Element | null = null;
let currentEase: EaseType = "elegant";
let currentMotion: MotionType = "static";
let currentStyle: StyleType = "default";
function applyMotion(motion: MotionType): void {
    document.body.classList.remove(...MOTION_CLASSES);
    document.body.classList.add(`asri-enhance-smooth-caret-motion-${motion}`);
}
function applyStyle(style: StyleType): void {
    document.body.classList.remove(...STYLE_CLASSES);
    document.body.classList.add(`asri-enhance-smooth-caret-style-${style}`);
}
function applyEase(ease: EaseType): void {
    const caret = document.getElementById(CARET_ITEM_ID);
    if (caret) {
        caret.style.setProperty("--asri-enhance-smooth-caret-ease", EASE_MAP[ease] || EASE_MAP.elegant);
    }
}
function initSmoothCaret(): void {
    document.getElementById(CARET_ITEM_ID)?.remove();
    const caretElement = document.createElement("div");
    caretElement.id = CARET_ITEM_ID;
    document.body.appendChild(caretElement);
    applyEase(currentEase);
    let isAnimationFramePending = false;
    const calculateCaretZIndex = (targetElement: Element): number => {
        if (targetElement === lastTargetElement) {
            return cachedZIndex;
        }
        let currentElement: Element | null = targetElement;
        let fullscreenZIndex: number | null = null;
        while (currentElement && currentElement !== document.body) {
            if (
                currentElement.classList.contains("b3-dialog") ||
                currentElement.classList.contains("block__popover--open") ||
                currentElement.id === "commonMenu"
            ) {
                const zIndex = parseInt(window.getComputedStyle(currentElement).zIndex) || 0;
                cachedZIndex = zIndex;
                lastTargetElement = targetElement;
                return zIndex;
            }
            if (currentElement.classList.contains("fullscreen") && fullscreenZIndex === null) {
                fullscreenZIndex = parseInt(window.getComputedStyle(currentElement).zIndex) || 0;
            }
            currentElement = currentElement.parentElement;
        }
        cachedZIndex = fullscreenZIndex !== null ? fullscreenZIndex : 0;
        lastTargetElement = targetElement;
        return cachedZIndex;
    };
    const updateCaretPosition = () => {
        isAnimationFramePending = false;
        const sel = window.getSelection();
        const focusElement = sel?.focusNode?.parentElement;
        if (focusElement?.classList?.contains("av__cursor")) {
            caretElement.classList.add("asri-enhance-smooth-caret-item-none");
            return;
        }
        const isSelfContentEditableFalse = focusElement?.getAttribute?.("contenteditable") === "false";
        if (isSelfContentEditableFalse) {
            caretElement.classList.add("asri-enhance-smooth-caret-item-none");
            return;
        }
        const targetElement =
            focusElement?.closest('[contenteditable="true"]') ||
            (focusElement?.closest(".protyle-title") ? focusElement : null);
        if (sel?.rangeCount && targetElement) {
            const range = sel.getRangeAt(0);
            let rect = range.getClientRects()[0];
            if (!rect || rect.height === 0) {
                let textNode: Text | null = null;
                try {
                    const cloneRange = range.cloneRange();
                    textNode = document.createTextNode("\u200B");
                    cloneRange.insertNode(textNode);
                    cloneRange.selectNode(textNode);
                    rect = cloneRange.getBoundingClientRect();
                } catch (_e) {
                    // ignore
                } finally {
                    if (textNode?.parentNode) {
                        textNode.parentNode.removeChild(textNode);
                    }
                }
            }
            if (rect) {
                if (focusElement !== cachedFocusElement) {
                    cachedFocusElement = focusElement ?? null;
                    cachedScrollContainer = focusElement?.closest(".protyle-content") as HTMLElement | null;
                }
                if (cachedScrollContainer) {
                    const containerRect = cachedScrollContainer.getBoundingClientRect();
                    const isInScrollContainer =
                        rect.left >= containerRect.left &&
                        rect.top >= containerRect.top &&
                        rect.right <= containerRect.right &&
                        rect.bottom <= containerRect.bottom;
                    if (!isInScrollContainer) {
                        caretElement.classList.add("asri-enhance-smooth-caret-item-none");
                        return;
                    }
                }
                caretElement.classList.remove("asri-enhance-smooth-caret-item-none");
                const isBlock = currentStyle === "block";
                const isUnderline = currentStyle === "underline";
                const needsCharWidth = isBlock || isUnderline;
                const charWidth = (() => {
                    if (!needsCharWidth) return null;
                    try {
                        const cloneRange = range.cloneRange();
                        cloneRange.collapse(true);
                        const startRect = cloneRange.getClientRects()[0];
                        if (!startRect) return null;
                        const endX = startRect.right;
                        cloneRange.setEnd(
                            cloneRange.endContainer,
                            Math.min(cloneRange.endOffset + 1, (cloneRange.endContainer as Text).length || cloneRange.endOffset)
                        );
                        const endRect = cloneRange.getClientRects()[0];
                        if (endRect && endRect.right > endX) {
                            return endRect.right - endX;
                        }
                    } catch (_e) {
                        // ignore
                    }
                    return rect.height * 0.6;
                })();
                const x = needsCharWidth ? rect.left : rect.left - 0.75;
                const y = isUnderline
                    ? rect.top + rect.height * 1.05
                    : rect.top - rect.height * 0.025;
                caretElement.style.translate = `${x}px ${y}px`;
                caretElement.style.height = isUnderline
                    ? `${Math.min(rect.height * 0.15, 3)}px`
                    : `${rect.height * 1.05}px`;
                caretElement.style.width = needsCharWidth ? `${charWidth ?? rect.height * 0.6}px` : "";
                caretElement.style.zIndex = (calculateCaretZIndex(targetElement) + 1).toString();
                const textColor = (() => {
                    const focusNode = sel.focusNode;
                    if (focusNode) {
                        if (focusNode.nodeType === Node.TEXT_NODE) {
                            const parentEl = focusNode.parentElement;
                            if (parentEl) return window.getComputedStyle(parentEl).color;
                        } else if (focusNode.nodeType === Node.ELEMENT_NODE) {
                            return window.getComputedStyle(focusNode as Element).color;
                        }
                    }
                    return window.getComputedStyle(targetElement).color;
                })();
                if (textColor && textColor !== "transparent" && !/rgba?\([^)]*,\s*0\s*\)$/i.test(textColor)) {
                    caretElement.style.setProperty("--asri-enhance-smooth-caret-color", textColor);
                } else {
                    caretElement.style.removeProperty("--asri-enhance-smooth-caret-color");
                }
                return;
            }
        }
        caretElement.classList.add("asri-enhance-smooth-caret-item-none");
    };
    const handleCaretUpdateTrigger = () => {
        if (!isAnimationFramePending) {
            window.requestAnimationFrame(updateCaretPosition);
            isAnimationFramePending = true;
        }
    };
    const handleThrottledCaretUpdate = () => {
        throttleTimers.forEach(timer => clearTimeout(timer));
        throttleTimers = [];
        [200, 400, 600].forEach(delay => {
            const timer = window.setTimeout(() => {
                handleCaretUpdateTrigger();
                const idx = throttleTimers.indexOf(timer);
                if (idx > -1) throttleTimers.splice(idx, 1);
            }, delay);
            throttleTimers.push(timer);
        });
    };
    throttledCaretEventHandler = handleThrottledCaretUpdate;
    smoothCaretEventHandler = handleCaretUpdateTrigger;
    document.addEventListener("selectionchange", handleCaretUpdateTrigger);
    document.addEventListener("scroll", handleCaretUpdateTrigger, { capture: true, passive: true });
    document.addEventListener("keyup", handleThrottledCaretUpdate);
    document.addEventListener("mouseup", handleThrottledCaretUpdate);
    updateCaretPosition();
}
function destroySmoothCaret(): void {
    document.getElementById(CARET_ITEM_ID)?.remove();
    document.body.classList.remove(...MOTION_CLASSES);
    document.body.classList.remove(...STYLE_CLASSES);
    throttleTimers.forEach(timer => clearTimeout(timer));
    throttleTimers = [];
    cachedZIndex = 0;
    lastTargetElement = null;
    cachedScrollContainer = null;
    cachedFocusElement = null;
    if (smoothCaretEventHandler) {
        document.removeEventListener("selectionchange", smoothCaretEventHandler);
        document.removeEventListener("scroll", smoothCaretEventHandler, { capture: true });
        smoothCaretEventHandler = null;
    }
    if (throttledCaretEventHandler) {
        document.removeEventListener("keyup", throttledCaretEventHandler);
        document.removeEventListener("mouseup", throttledCaretEventHandler);
        throttledCaretEventHandler = null;
    }
}
export { destroySmoothCaret };
function buildSettingsHTML(plugin: Plugin): string {
    const i18n = plugin.i18n;
    const easeOptions = (["elegant", "shuttle", "drift", "spring"] as EaseType[])
        .map(v => `<option value="${v}">${i18n[`smoothCaretEase${v.charAt(0).toUpperCase() + v.slice(1)}`]}</option>`)
        .join("");
    const motionOptions = (["static", "breathing", "stretch"] as MotionType[])
        .map(v => `<option value="${v}">${i18n[`smoothCaretMotion${v.charAt(0).toUpperCase() + v.slice(1)}`]}</option>`)
        .join("");
    const styleOptions = (["default", "neon", "rainbow", "block", "underline"] as StyleType[])
        .map(v => `<option value="${v}">${i18n[`smoothCaretStyle${v.charAt(0).toUpperCase() + v.slice(1)}`]}</option>`)
        .join("");
    return `<div class="b3-dialog__content">
    <div class="fn__flex b3-label config__item">
        <div class="fn__flex-1">
            ${i18n.smoothCaretEase}
            <div class="b3-label__text">${i18n.smoothCaretEaseTip}</div>
        </div>
        <span class="fn__space"></span>
        <select class="b3-select fn__flex-center fn__size200" id="asri-enhance-smooth-caret-ease">
            ${easeOptions}
        </select>
    </div>
    <div class="fn__flex b3-label config__item">
        <div class="fn__flex-1">
            ${i18n.smoothCaretMotion}
            <div class="b3-label__text">${i18n.smoothCaretMotionTip}</div>
        </div>
        <span class="fn__space"></span>
        <select class="b3-select fn__flex-center fn__size200" id="asri-enhance-smooth-caret-motion">
            ${motionOptions}
        </select>
    </div>
    <div class="fn__flex b3-label config__item">
        <div class="fn__flex-1">
            ${i18n.smoothCaretStyle}
            <div class="b3-label__text">${i18n.smoothCaretStyleTip}</div>
        </div>
        <span class="fn__space"></span>
        <select class="b3-select fn__flex-center fn__size200" id="asri-enhance-smooth-caret-style">
            ${styleOptions}
        </select>
    </div>
</div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel" id="asri-enhance-smooth-caret-cancel">${i18n.cancel}</button>
    <div class="fn__space"></div>
    <button class="b3-button b3-button--text" id="asri-enhance-smooth-caret-confirm">${i18n.confirm}</button>
</div>`;
}
export function showSmoothCaretSettings(plugin: Plugin): void {
    const dialog = new Dialog({
        title: plugin.i18n.smoothCaretSettings || "Smooth Caret Settings",
        content: buildSettingsHTML(plugin),
        width: "620px",
        height: "auto",
    });
    dialog.element.setAttribute("data-key", "dialog-asri-enhance-smooth-caret-settings");
    const easeSelect = dialog.element.querySelector("#asri-enhance-smooth-caret-ease") as HTMLSelectElement;
    const motionSelect = dialog.element.querySelector("#asri-enhance-smooth-caret-motion") as HTMLSelectElement;
    const styleSelect = dialog.element.querySelector("#asri-enhance-smooth-caret-style") as HTMLSelectElement;
    if (easeSelect) easeSelect.value = currentEase;
    if (motionSelect) motionSelect.value = currentMotion;
    if (styleSelect) styleSelect.value = currentStyle;
    dialog.element.querySelector("#asri-enhance-smooth-caret-cancel")?.addEventListener("click", () => dialog.destroy());
    dialog.element.querySelector("#asri-enhance-smooth-caret-confirm")?.addEventListener("click", async () => {
        let changed = false;
        const newConfig: Record<string, unknown> = {};
        if (easeSelect) {
            const newEase = easeSelect.value as EaseType;
            if (newEase !== currentEase) {
                currentEase = newEase;
                applyEase(newEase);
                newConfig[CONFIG_EASE_KEY] = newEase;
                changed = true;
            }
        }
        if (motionSelect) {
            const newMotion = motionSelect.value as MotionType;
            if (newMotion !== currentMotion) {
                currentMotion = newMotion;
                applyMotion(newMotion);
                newConfig[CONFIG_MOTION_KEY] = newMotion;
                changed = true;
            }
        }
        if (styleSelect) {
            const newStyle = styleSelect.value as StyleType;
            if (newStyle !== currentStyle) {
                currentStyle = newStyle;
                applyStyle(newStyle);
                newConfig[CONFIG_STYLE_KEY] = newStyle;
                changed = true;
            }
        }
        if (changed) {
            const config = await loadData(plugin, CONFIG_FILE) || {};
            Object.assign(config, newConfig);
            await saveData(plugin, CONFIG_FILE, config).catch(() => {});
        }
        dialog.destroy();
    });
}
export async function onSmoothCaretClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) return;
    const isActive = htmlEl.hasAttribute("data-asri-enhance-smoothcaret");
    const config = (await loadData(plugin, CONFIG_FILE)) || {};
    if (isActive) {
        htmlEl.removeAttribute("data-asri-enhance-smoothcaret");
        config[CONFIG_KEY] = false;
        destroySmoothCaret();
    } else {
        htmlEl.setAttribute("data-asri-enhance-smoothcaret", "true");
        config[CONFIG_KEY] = true;
        applyMotion(currentMotion);
        applyStyle(currentStyle);
        initSmoothCaret();
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {});
}
export async function applySmoothCaretConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) return;
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (!configData) return;
    currentEase = (configData[CONFIG_EASE_KEY] as EaseType) || "elegant";
    currentMotion = (configData[CONFIG_MOTION_KEY] as MotionType) || "static";
    currentStyle = (configData[CONFIG_STYLE_KEY] as StyleType) || "default";
    if (configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-smoothcaret", "true");
        applyMotion(currentMotion);
        applyStyle(currentStyle);
        initSmoothCaret();
    } else {
        htmlEl.removeAttribute("data-asri-enhance-smoothcaret");
        destroySmoothCaret();
    }
}
