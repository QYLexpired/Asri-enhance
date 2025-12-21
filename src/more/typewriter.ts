import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-typewriter";
let cursorObserver: {
    destroy: () => void;
} | null = null;
let isEnabled: boolean = false;
let isMousePressed: boolean = false;
let mousePressTimer: number | null = null;
let isLongPress: boolean = false;
const LONG_PRESS_DURATION: number = 500;
function getCursorElement(): Element | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
        return null;
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    let element: Element | null;
    if (container.nodeType === Node.TEXT_NODE) {
        element = (container as Text).parentElement;
    }
    else {
        element = container.nodeType === Node.ELEMENT_NODE ? (container as Element) : null;
    }
    if (element) {
        let current: HTMLElement | null = element as HTMLElement;
        while (current && current !== document.body) {
            if ((current as any).hasAttribute && current.hasAttribute("contenteditable")) {
                return element;
            }
            current = current.parentElement;
        }
    }
    return null;
}
function shouldScroll(element: Element | null): boolean {
    if (!element)
        return false;
    const elementRect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const elementCenterY = elementRect.top + elementRect.height / 2;
    const elementCenterX = elementRect.left + elementRect.width / 2;
    const windowCenterY = windowHeight / 2;
    const windowCenterX = windowWidth / 2;
    const scrollY = Math.abs(elementCenterY - windowCenterY);
    const scrollX = Math.abs(elementCenterX - windowCenterX);
    return scrollY > 5 || scrollX > 5;
}
function scrollToElementCenter(element: Element | null): void {
    if (!element)
        return;
    if (!shouldScroll(element)) {
        return;
    }
    element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
    });
}
function observeCursorPosition(): {
    destroy: () => void;
} {
    let lastCursorElement: Element | null = null;
    const checkCursorPosition = (): void => {
        if (!isEnabled || isMousePressed || isLongPress)
            return;
        const currentCursorElement = getCursorElement();
        if (currentCursorElement !== lastCursorElement) {
            lastCursorElement = currentCursorElement;
            if (currentCursorElement) {
                setTimeout(() => {
                    scrollToElementCenter(currentCursorElement);
                }, 50);
            }
        }
    };
    const handleMouseDown = (): void => {
        isMousePressed = true;
        isLongPress = false;
        mousePressTimer = window.setTimeout(() => {
            isLongPress = true;
        }, LONG_PRESS_DURATION);
    };
    const handleMouseUp = (): void => {
        isMousePressed = false;
        if (mousePressTimer) {
            clearTimeout(mousePressTimer);
            mousePressTimer = null;
        }
        if (isLongPress) {
            setTimeout(() => {
                isLongPress = false;
            }, 200);
        }
        else {
            setTimeout(checkCursorPosition, 10);
        }
    };
    const handleMouseLeave = (): void => {
        isMousePressed = false;
        isLongPress = false;
        if (mousePressTimer) {
            clearTimeout(mousePressTimer);
            mousePressTimer = null;
        }
    };
    document.addEventListener("selectionchange", checkCursorPosition);
    document.addEventListener("keydown", checkCursorPosition);
    document.addEventListener("keyup", checkCursorPosition);
    document.addEventListener("click", checkCursorPosition);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    return {
        destroy: (): void => {
            document.removeEventListener("selectionchange", checkCursorPosition);
            document.removeEventListener("keydown", checkCursorPosition);
            document.removeEventListener("keyup", checkCursorPosition);
            document.removeEventListener("click", checkCursorPosition);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseleave", handleMouseLeave);
            if (mousePressTimer) {
                clearTimeout(mousePressTimer);
                mousePressTimer = null;
            }
        }
    };
}
export function initFocusEditing(): void {
    if (cursorObserver) {
        removeFocusEditing();
    }
    isEnabled = true;
    cursorObserver = observeCursorPosition();
}
export function removeFocusEditing(): void {
    isEnabled = false;
    if (cursorObserver) {
        cursorObserver.destroy();
        cursorObserver = null;
    }
}
export async function onTypewriterClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute("data-asri-enhance-typewriter");
    const config = await loadData(plugin, CONFIG_FILE) || {};
    if (isActive) {
        htmlEl.removeAttribute("data-asri-enhance-typewriter");
        config[CONFIG_KEY] = false;
        removeFocusEditing();
    }
    else {
        htmlEl.setAttribute("data-asri-enhance-typewriter", "true");
        config[CONFIG_KEY] = true;
        initFocusEditing();
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
export async function applyTypewriterConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-typewriter", "true");
        initFocusEditing();
    }
    else {
        htmlEl.removeAttribute("data-asri-enhance-typewriter");
        removeFocusEditing();
    }
}
