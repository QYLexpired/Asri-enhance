import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-listbulletline";
const SELECTOR = ".asri-bullet-highlight,.asri-bullet-line";
const SELECTED_CLASS = "asri-bullet-highlight";
const LINE_CLASS = "asri-bullet-line";
const LINE_HEIGHT_VAR = "--asri-bullet-line-height";
let selectionChangeHandler: (() => void) | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastMarkedItems: Set<HTMLElement> = new Set();
const clearBulletLineMarks = () => {
    document.querySelectorAll<HTMLElement>(SELECTOR).forEach((element) => {
        element.classList.remove(SELECTED_CLASS, LINE_CLASS);
        element.style.removeProperty(LINE_HEIGHT_VAR);
    });
    lastMarkedItems.clear();
};
const removeMarkFromItem = (item: HTMLElement) => {
    item.classList.remove(SELECTED_CLASS, LINE_CLASS);
    item.style.removeProperty(LINE_HEIGHT_VAR);
};
const addMarkToItem = (item: HTMLElement, hasNext: boolean, nextItem?: HTMLElement) => {
    item.classList.add(SELECTED_CLASS);
    if (hasNext && nextItem) {
        const currentRect = item.getBoundingClientRect();
        const nextRect = nextItem.getBoundingClientRect();
        item.style.setProperty(LINE_HEIGHT_VAR, `${currentRect.top - nextRect.top}px`);
        item.classList.add(LINE_CLASS);
    }
};
const runSelectionUpdate = () => {
    const selection = window.getSelection();
    const currentListItems: HTMLElement[] = [];
    if (selection && selection.rangeCount) {
        let node: Node | null = selection.getRangeAt(0).startContainer;
        while (node && node.nodeType !== Node.ELEMENT_NODE) {
            node = node.parentElement;
        }
        while (node) {
            const element = node as HTMLElement;
            if (element.dataset?.type === "NodeListItem") {
                currentListItems.push(element);
            }
            if (element.classList?.contains("protyle-wysiwyg")) {
                break;
            }
            node = element.parentElement;
        }
    }
    const currentSet = new Set(currentListItems);
    lastMarkedItems.forEach((item) => {
        if (!currentSet.has(item)) {
            removeMarkFromItem(item);
        }
    });
    currentListItems.forEach((item, index) => {
        const hasNext = index < currentListItems.length - 1;
        const nextItem = hasNext ? currentListItems[index + 1] : undefined;
        if (!lastMarkedItems.has(item)) {
            addMarkToItem(item, hasNext, nextItem);
        }
        else {
            if (hasNext && nextItem) {
                const currentRect = item.getBoundingClientRect();
                const nextRect = nextItem.getBoundingClientRect();
                const newHeight = `${currentRect.top - nextRect.top}px`;
                const oldHeight = item.style.getPropertyValue(LINE_HEIGHT_VAR);
                if (oldHeight !== newHeight) {
                    item.style.setProperty(LINE_HEIGHT_VAR, newHeight);
                }
                if (!item.classList.contains(LINE_CLASS)) {
                    item.classList.add(LINE_CLASS);
                }
            }
            else {
                if (item.classList.contains(LINE_CLASS)) {
                    item.classList.remove(LINE_CLASS);
                    item.style.removeProperty(LINE_HEIGHT_VAR);
                }
            }
        }
    });
    lastMarkedItems = currentSet;
};
const bindSelectionChange = () => {
    if (selectionChangeHandler) {
        return;
    }
    selectionChangeHandler = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(() => {
            runSelectionUpdate();
            debounceTimer = null;
        }, 50);
    };
    document.addEventListener("selectionchange", selectionChangeHandler);
    runSelectionUpdate();
};
const unbindSelectionChange = () => {
    if (!selectionChangeHandler) {
        clearBulletLineMarks();
        return;
    }
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
    }
    document.removeEventListener("selectionchange", selectionChangeHandler);
    selectionChangeHandler = null;
    clearBulletLineMarks();
};
export async function onListBulletLineClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute("data-asri-enhance-listbulletline");
    const config = await loadData(plugin, CONFIG_FILE) || {};
    if (isActive) {
        htmlEl.removeAttribute("data-asri-enhance-listbulletline");
        config[CONFIG_KEY] = false;
        unbindSelectionChange();
    }
    else {
        htmlEl.setAttribute("data-asri-enhance-listbulletline", "true");
        config[CONFIG_KEY] = true;
        bindSelectionChange();
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
export async function applyListBulletLineConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-listbulletline", "true");
        bindSelectionChange();
    }
    else {
        htmlEl.removeAttribute("data-asri-enhance-listbulletline");
        unbindSelectionChange();
    }
}
export const removeListBulletLineEffect = () => {
    unbindSelectionChange();
};
