import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-smoothcaret";
const CARET_ITEM_ID = 'asri-enhance-smooth-caret-item';
let smoothCaretEventHandler: (() => void) | null = null;
let throttledCaretEventHandler: (() => void) | null = null;
let throttleTimers: number[] = [];
let cachedZIndex = 0;
let lastTargetElement: Element | null = null;
let cachedScrollContainer: HTMLElement | null = null;
let cachedFocusElement: Element | null = null;
const initSmoothCaret = () => {
    document.getElementById(CARET_ITEM_ID)?.remove();
    const caretElement = document.createElement('div');
    caretElement.id = CARET_ITEM_ID;
    document.body.appendChild(caretElement);
    let isAnimationFramePending = false;
    const calculateCaretZIndex = (targetElement: Element): number => {
        if (targetElement === lastTargetElement) {
            return cachedZIndex;
        }
        let currentElement: Element | null = targetElement;
        while (currentElement && currentElement !== document.body) {
            if (currentElement.classList.contains('b3-dialog') ||
                currentElement.classList.contains('block__popover--open') ||
                currentElement.id === 'commonMenu') {
                const computedStyle = window.getComputedStyle(currentElement);
                const zIndexValue = computedStyle.zIndex;
                const zIndex = parseInt(zIndexValue) || 0;
                cachedZIndex = zIndex;
                lastTargetElement = targetElement;
                return zIndex;
            }
            currentElement = currentElement.parentElement;
        }
        cachedZIndex = 0;
        lastTargetElement = targetElement;
        return 0;
    };
    const updateCaretPosition = () => {
        isAnimationFramePending = false;
        const sel = window.getSelection();
        const focusElement = sel.focusNode?.parentElement;
        if (focusElement?.classList?.contains('av__cursor')) {
            caretElement.classList.add('asri-enhance-smooth-caret-item-none');
            return;
        }
        const isSelfContentEditableFalse = focusElement?.getAttribute?.('contenteditable') === 'false';
        if (isSelfContentEditableFalse) {
            caretElement.classList.add('asri-enhance-smooth-caret-item-none');
            return;
        }
        const targetElement = focusElement?.closest('[contenteditable="true"]') ||
            (focusElement?.closest('.protyle-title') ? focusElement : null);
        if (sel.rangeCount && targetElement) {
            const range = sel.getRangeAt(0);
            let rect = range.getClientRects()[0];
            if (!rect || rect.height === 0) {
                let textNode: Text | null = null;
                try {
                    const cloneRange = range.cloneRange();
                    textNode = document.createTextNode('\u200B');
                    cloneRange.insertNode(textNode);
                    cloneRange.selectNode(textNode);
                    rect = cloneRange.getBoundingClientRect();
                } catch (e) {
                } finally {
                    if (textNode?.parentNode) {
                        textNode.parentNode.removeChild(textNode);
                    }
                }
            }
            if (rect) {
                if (focusElement !== cachedFocusElement) {
                    cachedFocusElement = focusElement ?? null;
                    cachedScrollContainer = focusElement?.closest('.protyle-content') as HTMLElement | null;
                }
                if (cachedScrollContainer) {
                    const containerRect = cachedScrollContainer.getBoundingClientRect();
                    const isInScrollContainer = 
                        rect.left >= containerRect.left && 
                        rect.top >= containerRect.top && 
                        rect.right <= containerRect.right && 
                        rect.bottom <= containerRect.bottom;
                    if (!isInScrollContainer) {
                        caretElement.classList.add('asri-enhance-smooth-caret-item-none');
                        return;
                    }
                }
                caretElement.classList.remove('asri-enhance-smooth-caret-item-none');
                caretElement.style.transform = `translate3d(${rect.left - 0.75}px, ${rect.top - rect.height * 0.025}px, 0)`;
                caretElement.style.height = `${rect.height * 1.05}px`;
                const baseZIndex = calculateCaretZIndex(targetElement);
                caretElement.style.zIndex = (baseZIndex + 1).toString();
                let textColor: string | null = null;
                const focusNode = sel.focusNode;
                if (focusNode) {
                    if (focusNode.nodeType === Node.TEXT_NODE) {
                        const parentElement = focusNode.parentElement;
                        if (parentElement) {
                            textColor = window.getComputedStyle(parentElement).color;
                        }
                    } else if (focusNode.nodeType === Node.ELEMENT_NODE) {
                        textColor = window.getComputedStyle(focusNode as Element).color;
                    }
                }
                if (!textColor) {
                    textColor = window.getComputedStyle(targetElement).color;
                }
                if (textColor && textColor !== 'transparent' && !/rgba?\([^)]*,\s*0\s*\)$/i.test(textColor)) {
                    caretElement.style.setProperty('--asri-enhance-smooth-caret-color', textColor);
                } else {
                    caretElement.style.removeProperty('--asri-enhance-smooth-caret-color');
                }
                return;
            }
        }
        caretElement.classList.add('asri-enhance-smooth-caret-item-none');
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
        const delays = [200, 400, 600];
        delays.forEach(delay => {
            const timer = window.setTimeout(() => {
                handleCaretUpdateTrigger();
                const index = throttleTimers.indexOf(timer);
                if (index > -1) {
                    throttleTimers.splice(index, 1);
                }
            }, delay);
            throttleTimers.push(timer);
        });
    };
    throttledCaretEventHandler = handleThrottledCaretUpdate;
    smoothCaretEventHandler = handleCaretUpdateTrigger;
    document.addEventListener('selectionchange', handleCaretUpdateTrigger);
    document.addEventListener('scroll', handleCaretUpdateTrigger, { capture: true, passive: true });
    document.addEventListener('keyup', handleThrottledCaretUpdate);
    document.addEventListener('mouseup', handleThrottledCaretUpdate);
    updateCaretPosition();
};
const destroySmoothCaret = () => {
    document.getElementById(CARET_ITEM_ID)?.remove();
    throttleTimers.forEach(timer => clearTimeout(timer));
    throttleTimers = [];
    cachedZIndex = 0;
    lastTargetElement = null;
    cachedScrollContainer = null;
    cachedFocusElement = null;
    if (smoothCaretEventHandler) {
        document.removeEventListener('selectionchange', smoothCaretEventHandler);
        document.removeEventListener('scroll', smoothCaretEventHandler, { capture: true });
        smoothCaretEventHandler = null;
    }
    if (throttledCaretEventHandler) {
        document.removeEventListener('keyup', throttledCaretEventHandler);
        document.removeEventListener('mouseup', throttledCaretEventHandler);
        throttledCaretEventHandler = null;
    }
};
export { destroySmoothCaret };
export async function onSmoothCaretClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute("data-asri-enhance-smoothcaret");
    const config = await loadData(plugin, CONFIG_FILE) || {};
    if (isActive) {
        htmlEl.removeAttribute("data-asri-enhance-smoothcaret");
        config[CONFIG_KEY] = false;
        destroySmoothCaret();
    }
    else {
        htmlEl.setAttribute("data-asri-enhance-smoothcaret", "true");
        config[CONFIG_KEY] = true;
        initSmoothCaret();
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
export async function applySmoothCaretConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-smoothcaret", "true");
        initSmoothCaret();
    }
    else {
        htmlEl.removeAttribute("data-asri-enhance-smoothcaret");
        destroySmoothCaret();
    }
}
