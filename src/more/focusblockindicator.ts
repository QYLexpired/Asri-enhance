import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-focus-block-indicator";
const DATA_ATTR = "data-asri-enhance-focusblockindicator";
const FOCUS_BLOCK_ATTR = "asri-enhance-focus-block";
let selectionChangeHandler: (() => void) | null = null;
let pendingUpdate = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_DELAY = 200;
function clearAllFocusBlocks(): void {
    document.querySelectorAll(`[${FOCUS_BLOCK_ATTR}]`).forEach((el) => {
        el.removeAttribute(FOCUS_BLOCK_ATTR);
    });
}
function applyFocusBlock(): void {
    pendingUpdate = false;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return;
    }
    const focusNode = selection.focusNode;
    if (!focusNode) {
        return;
    }
    const curBlock = (focusNode.nodeType === Node.ELEMENT_NODE ? focusNode as Element : focusNode.parentElement)?.closest("[data-node-id]");
    if (!curBlock) {
        return;
    }
    clearAllFocusBlocks();
    curBlock.setAttribute(FOCUS_BLOCK_ATTR, "");
}
function handleUpdate(): void {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
        if (pendingUpdate) {
            applyFocusBlock();
        }
    }, DEBOUNCE_DELAY);
}
function startObserving(): void {
    if (selectionChangeHandler) {
        return;
    }
    selectionChangeHandler = () => {
        pendingUpdate = true;
        handleUpdate();
    };
    document.addEventListener("selectionchange", selectionChangeHandler);
}
function stopObserving(): void {
    if (selectionChangeHandler) {
        document.removeEventListener("selectionchange", selectionChangeHandler);
        selectionChangeHandler = null;
    }
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
    }
    pendingUpdate = false;
    clearAllFocusBlocks();
}
export async function onFocusBlockIndicatorClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute(DATA_ATTR);
    const config = await loadData(plugin, CONFIG_FILE) || {};
    if (isActive) {
        htmlEl.removeAttribute(DATA_ATTR);
        config[CONFIG_KEY] = false;
        stopObserving();
    }
    else {
        htmlEl.setAttribute(DATA_ATTR, "true");
        config[CONFIG_KEY] = true;
        startObserving();
        applyFocusBlock();
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
export async function applyFocusBlockIndicatorConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute(DATA_ATTR, "true");
        startObserving();
        applyFocusBlock();
    }
    else {
        htmlEl.removeAttribute(DATA_ATTR);
        stopObserving();
    }
}
export function destroyFocusBlockIndicator(): void {
    document.documentElement?.removeAttribute(DATA_ATTR);
    stopObserving();
}
