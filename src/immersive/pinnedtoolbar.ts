import { getFrontend, Plugin, Dialog } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-pinnedtoolbar";
const CONFIG_DIRECTION_KEY = "asri-enhance-pinnedtoolbar-direction";
const CONFIG_LIQUID_GLASS_KEY = "asri-enhance-pinnedtoolbar-liquid-glass";
const isMobile = () => {
    return getFrontend().endsWith("mobile");
};
const POSITION_CLASSES = [
    "asri-enhance-pinnedtoolbar-left",
    "asri-enhance-pinnedtoolbar-bottom",
    "asri-enhance-pinnedtoolbar-right",
    "asri-enhance-pinnedtoolbar-top"
];
const DEBOUNCE_DELAY = 200;
const LIQUID_GLASS_SVG_ID = "asri-enhance-pinnedtoolbar-liquid-glass-svg";
const LIQUID_GLASS_CLASS = "asri-enhance-pinnedtoolbar-liquid-glass";
const READONLY_CLASS = "asri-enhance-pinnedtoolbar-notreadonly";
type PinnedToolbarDirection = "top" | "bottom" | "left" | "right";
let contextMenuHandler: ((e: MouseEvent) => void) | null = null;
let lastContextMenuTime = 0;
let readonlyDetectorTimer: ReturnType<typeof setTimeout> | null = null;
let isReadonlyDetectorActive = false;
let currentDirection: PinnedToolbarDirection = "top";
function applyPinnedToolbarDirectionClass(direction: PinnedToolbarDirection): void {
    currentDirection = direction || "top";
}
function injectLiquidGlassSVG(): void {
    if (document.getElementById(LIQUID_GLASS_SVG_ID)) return;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = LIQUID_GLASS_SVG_ID;
    svg.setAttribute("style", "display: none;");
    svg.innerHTML = `
        <defs>
            <filter id="pinnedtoolbar-row" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
                <feImage href="data:image/png;base64,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" x="0" y="0" width="506" height="38" result="mapSource" preserveAspectRatio="none"></feImage>
                <feGaussianBlur in="mapSource" stdDeviation="0" result="map"></feGaussianBlur>
                <feDisplacementMap in="SourceGraphic" in2="map" scale="30.70289060990251" xChannelSelector="R" yChannelSelector="G" result="dispR"></feDisplacementMap>
                <feColorMatrix in="dispR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="R"></feColorMatrix>
                <feDisplacementMap in="SourceGraphic" in2="map" scale="32.318832220950014" xChannelSelector="R" yChannelSelector="G" result="dispG"></feDisplacementMap>
                <feColorMatrix in="dispG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="G"></feColorMatrix>
                <feDisplacementMap in="SourceGraphic" in2="map" scale="33.93477383199752" xChannelSelector="R" yChannelSelector="G" result="dispB"></feDisplacementMap>
                <feColorMatrix in="dispB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="B"></feColorMatrix>
                <feBlend in="R" in2="G" mode="screen" result="RG"></feBlend>
                <feBlend in="RG" in2="B" mode="screen" result="refracted"></feBlend>
                <feComposite in="refracted" in2="SourceGraphic" operator="in"></feComposite>
            </filter>
            <filter id="pinnedtoolbar-column" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
                <feImage href="data:image/png;base64,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" x="0" y="0" width="38" height="506" result="mapSource" preserveAspectRatio="none"></feImage>
                <feGaussianBlur in="mapSource" stdDeviation="0" result="map"></feGaussianBlur>
                <feDisplacementMap in="SourceGraphic" in2="map" scale="30.70289060990251" xChannelSelector="R" yChannelSelector="G" result="dispR"></feDisplacementMap>
                <feColorMatrix in="dispR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="R"></feColorMatrix>
                <feDisplacementMap in="SourceGraphic" in2="map" scale="32.318832220950014" xChannelSelector="R" yChannelSelector="G" result="dispG"></feDisplacementMap>
                <feColorMatrix in="dispG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="G"></feColorMatrix>
                <feDisplacementMap in="SourceGraphic" in2="map" scale="33.93477383199752" xChannelSelector="R" yChannelSelector="G" result="dispB"></feDisplacementMap>
                <feColorMatrix in="dispB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="B"></feColorMatrix>
                <feBlend in="R" in2="G" mode="screen" result="RG"></feBlend>
                <feBlend in="RG" in2="B" mode="screen" result="refracted"></feBlend>
                <feComposite in="refracted" in2="SourceGraphic" operator="in"></feComposite>
            </filter>
        </defs>`;
    document.head.appendChild(svg);
}
function removeLiquidGlassSVG(): void {
    const svg = document.getElementById(LIQUID_GLASS_SVG_ID);
    if (svg) {
        svg.remove();
    }
}
function addLiquidGlassClass(): void {
    document.body.classList.add(LIQUID_GLASS_CLASS);
}
function removeLiquidGlassClass(): void {
    document.body.classList.remove(LIQUID_GLASS_CLASS);
}
function startReadonlyDetector(): void {
    if (readonlyDetectorTimer) return;
    isReadonlyDetectorActive = true;
    ensureToolbarClasses();
    document.addEventListener('visibilitychange', onVisibilityChange);
    const loop = () => {
        if (isReadonlyDetectorActive) {
            ensureToolbarClasses();
            const interval = document.visibilityState === 'visible' ? 200 : 1000;
            readonlyDetectorTimer = setTimeout(loop, interval);
        }
    };
    readonlyDetectorTimer = setTimeout(loop, 200);
}
function stopReadonlyDetector(): void {
    isReadonlyDetectorActive = false;
    if (readonlyDetectorTimer) {
        clearTimeout(readonlyDetectorTimer);
        readonlyDetectorTimer = null;
    }
    document.removeEventListener('visibilitychange', onVisibilityChange);
    const toolbars = document.querySelectorAll(".protyle-toolbar");
    toolbars.forEach(toolbar => {
        toolbar.classList.remove(READONLY_CLASS);
    });
}
function onVisibilityChange(): void {
    if (document.visibilityState === 'visible' && isReadonlyDetectorActive) {
        ensureToolbarClasses();
    }
}
function getDefaultPositionClass(): string {
    const directionIndex = POSITION_CLASSES.findIndex(cls => cls.includes(`-${currentDirection}`));
    if (directionIndex !== -1) {
        return POSITION_CLASSES[directionIndex];
    }
    return "asri-enhance-pinnedtoolbar-top";
}
function ensureToolbarClasses(): void {
    const toolbars = document.querySelectorAll(".protyle-toolbar");
    toolbars.forEach(toolbar => {
        const hasPositionClass = POSITION_CLASSES.some(cls => toolbar.classList.contains(cls));
        if (!hasPositionClass) {
            toolbar.classList.add(getDefaultPositionClass());
        }
        const protyle = toolbar.closest(".protyle") as HTMLElement;
        if (!protyle) {
            toolbar.classList.remove(READONLY_CLASS);
            return;
        }
        const wysiwyg = protyle.querySelector(".protyle-wysiwyg") as HTMLElement;
        if (wysiwyg && wysiwyg.getAttribute("data-readonly") === "false") {
            toolbar.classList.add(READONLY_CLASS);
        } else {
            toolbar.classList.remove(READONLY_CLASS);
        }
    });
}
export async function onPinnedToolbarClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (isMobile()) {
        return;
    }
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute("data-asri-enhance-pinnedtoolbar");
    const config = await loadData(plugin, CONFIG_FILE) || {};
    const isLiquidGlass = config[CONFIG_LIQUID_GLASS_KEY] === true;
    if (isActive) {
        htmlEl.removeAttribute("data-asri-enhance-pinnedtoolbar");
        config[CONFIG_KEY] = false;
        removeContextMenuListener();
        removePositionClasses();
        removeLiquidGlassSVG();
        removeLiquidGlassClass();
        stopReadonlyDetector();
    }
    else {
        htmlEl.setAttribute("data-asri-enhance-pinnedtoolbar", "true");
        config[CONFIG_KEY] = true;
        addContextMenuListener();
        if (isLiquidGlass) {
            injectLiquidGlassSVG();
            addLiquidGlassClass();
        }
        applyPinnedToolbarDirectionClass(config[CONFIG_DIRECTION_KEY] as PinnedToolbarDirection || "top");
        startReadonlyDetector();
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
function addContextMenuListener(): void {
    if (contextMenuHandler) return;
    contextMenuHandler = (e: MouseEvent) => {
        const now = Date.now();
        if (now - lastContextMenuTime < DEBOUNCE_DELAY) {
            return;
        }
        lastContextMenuTime = now;
        const target = e.target as HTMLElement;
        const toolbar = target.closest(".protyle-toolbar") as HTMLElement;
        if (!toolbar) return;
        e.preventDefault();
        e.stopPropagation();
        let currentPosition = -1;
        for (let i = 0; i < POSITION_CLASSES.length; i++) {
            if (toolbar.classList.contains(POSITION_CLASSES[i])) {
                currentPosition = i;
                break;
            }
        }
        toolbar.classList.remove(...POSITION_CLASSES);
        const nextPosition = (currentPosition + 1) % POSITION_CLASSES.length;
        toolbar.classList.add(POSITION_CLASSES[nextPosition]);
    };
    document.addEventListener("contextmenu", contextMenuHandler, true);
}
function removeContextMenuListener(): void {
    if (contextMenuHandler) {
        document.removeEventListener("contextmenu", contextMenuHandler, true);
        contextMenuHandler = null;
    }
}
function removePositionClasses(): void {
    const toolbars = document.querySelectorAll(".protyle-toolbar");
    toolbars.forEach(toolbar => {
        toolbar.classList.remove(...POSITION_CLASSES);
    });
}
export async function applyPinnedToolbarConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    if (isMobile()) {
        return;
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    const isLiquidGlass = configData?.[CONFIG_LIQUID_GLASS_KEY] === true;
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-pinnedtoolbar", "true");
        addContextMenuListener();
        if (isLiquidGlass) {
            injectLiquidGlassSVG();
            addLiquidGlassClass();
        }
        applyPinnedToolbarDirectionClass(configData[CONFIG_DIRECTION_KEY]);
        startReadonlyDetector();
    }
    else {
        htmlEl.removeAttribute("data-asri-enhance-pinnedtoolbar");
        removeContextMenuListener();
        removePositionClasses();
        removeLiquidGlassSVG();
        removeLiquidGlassClass();
        stopReadonlyDetector();
    }
}
export function destroyPinnedToolbar(): void {
    removeContextMenuListener();
    removePositionClasses();
    removeLiquidGlassSVG();
    removeLiquidGlassClass();
    stopReadonlyDetector();
    const htmlEl = document.documentElement;
    if (htmlEl) {
        htmlEl.removeAttribute("data-asri-enhance-pinnedtoolbar");
    }
}
export function onPinnedToolbarSettingsClick(plugin: Plugin, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const dialog = new Dialog({
        title: plugin.i18n?.pinnedToolbarSettings || "Configure Pinned Toolbar",
        content: `<div class="b3-dialog__content">
    <div class="fn__flex b3-label config__item">
        <div class="fn__flex-1">
            ${plugin.i18n?.pinnedToolbarDirection || "Default Direction"}
            <div class="b3-label__text">${plugin.i18n?.pinnedToolbarDirectionTip || "Set the default pinned direction for the toolbar"}</div>
        </div>
        <span class="fn__space"></span>
        <select class="b3-select fn__flex-center fn__size200" id="asri-enhance-pinnedtoolbar-direction">
            <option value="top">${plugin.i18n?.pinnedToolbarTop || "Top"}</option>
            <option value="bottom">${plugin.i18n?.pinnedToolbarBottom || "Bottom"}</option>
            <option value="left">${plugin.i18n?.pinnedToolbarLeft || "Left"}</option>
            <option value="right">${plugin.i18n?.pinnedToolbarRight || "Right"}</option>
        </select>
    </div>
    <div class="fn__flex b3-label config__item">
        <div class="fn__flex-1">
            ${plugin.i18n?.pinnedToolbarLiquidGlass || "Liquid Glass"}
            <div class="b3-label__text">${plugin.i18n?.pinnedToolbarLiquidGlassTip || "Give the pinned toolbar a liquid glass effect"}</div>
        </div>
        <span class="fn__space"></span>
        <input class="b3-switch fn__flex-center" id="asri-enhance-pinnedtoolbar-liquid-glass" type="checkbox">
    </div>
</div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel" id="asri-enhance-pinnedtoolbar-cancel">${plugin.i18n?.cancel || "Cancel"}</button>
    <div class="fn__space"></div>
    <button class="b3-button b3-button--text" id="asri-enhance-pinnedtoolbar-confirm">${plugin.i18n?.confirm || "Confirm"}</button>
</div>`,
        width: "620px",
        height: "auto",
    });
    dialog.element.setAttribute("data-key", "dialog-asri-enhance-pinnedtoolbar-settings");
    const directionSelect = dialog.element.querySelector<HTMLSelectElement>("#asri-enhance-pinnedtoolbar-direction");
    const liquidGlassCheckbox = dialog.element.querySelector<HTMLInputElement>("#asri-enhance-pinnedtoolbar-liquid-glass");
    void loadData(plugin, CONFIG_FILE).then((config) => {
        const savedDirection = config?.[CONFIG_DIRECTION_KEY] || "top";
        if (directionSelect) directionSelect.value = savedDirection;
        if (liquidGlassCheckbox) liquidGlassCheckbox.checked = config?.[CONFIG_LIQUID_GLASS_KEY] === true;
    }).catch(() => { });
    dialog.element.querySelector("#asri-enhance-pinnedtoolbar-cancel")?.addEventListener("click", () => {
        dialog.destroy();
    });
    dialog.element.querySelector("#asri-enhance-pinnedtoolbar-confirm")?.addEventListener("click", () => {
        const selectedDirection = (directionSelect?.value || "top") as PinnedToolbarDirection;
        const isLiquidGlass = liquidGlassCheckbox?.checked || false;
        void (async () => {
            const config = await loadData(plugin, CONFIG_FILE) || {};
            config[CONFIG_DIRECTION_KEY] = selectedDirection;
            config[CONFIG_LIQUID_GLASS_KEY] = isLiquidGlass;
            await saveData(plugin, CONFIG_FILE, config).catch(() => { });
            const htmlEl = document.documentElement;
            const isActive = !!htmlEl?.hasAttribute("data-asri-enhance-pinnedtoolbar");
            if (isActive) {
                applyPinnedToolbarDirectionClass(selectedDirection);
                if (isLiquidGlass) {
                    injectLiquidGlassSVG();
                    addLiquidGlassClass();
                } else {
                    removeLiquidGlassSVG();
                    removeLiquidGlassClass();
                }
            }
            dialog.destroy();
        })();
    });
}
