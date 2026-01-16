import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-smoothcaret";
const CARET_ITEM_ID = 'asri-enhance-smooth-caret-item';
let smoothCaretEventHandler: (() => void) | null = null;
const initSmoothCaret = () => {
    document.getElementById(CARET_ITEM_ID)?.remove();
    const caretElement = document.createElement('div');
    caretElement.id = CARET_ITEM_ID;
    document.body.appendChild(caretElement);
    let isAnimationFramePending = false;
    const updateCaretPosition = () => {
        isAnimationFramePending = false;
        const sel = window.getSelection();
        if (sel.rangeCount && sel.focusNode?.parentElement?.closest('[contenteditable]')) {
            const range = sel.getRangeAt(0);
            let rect = range.getClientRects()[0];
            if (!rect || rect.height === 0) {
                try {
                    const cloneRange = range.cloneRange();
                    const textNode = document.createTextNode('\u200B');
                    cloneRange.insertNode(textNode);
                    cloneRange.selectNode(textNode);
                    rect = cloneRange.getBoundingClientRect();
                    textNode.parentNode.removeChild(textNode);
                } catch (e) {
                }
            }
            if (rect) {
                caretElement.classList.remove('asri-enhance-smooth-caret-item-none');
                caretElement.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
                caretElement.style.height = `${rect.height * 1.1}px`;
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
    smoothCaretEventHandler = handleCaretUpdateTrigger;
    document.addEventListener('selectionchange', handleCaretUpdateTrigger);
    document.addEventListener('scroll', handleCaretUpdateTrigger, { capture: true, passive: true });
    updateCaretPosition();
};
const destroySmoothCaret = () => {
    document.getElementById(CARET_ITEM_ID)?.remove();
    if (smoothCaretEventHandler) {
        document.removeEventListener('selectionchange', smoothCaretEventHandler);
        document.removeEventListener('scroll', smoothCaretEventHandler);
        smoothCaretEventHandler = null;
    }
};
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
