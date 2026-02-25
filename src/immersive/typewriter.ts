import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-typewriter";
let typewriterEventHandler: (() => void) | null = null;
let isScrolling = false;
let scrollTimeout: number | null = null;
let rafId: number | null = null;
let throttleTimeout: number | null = null;
let lastMaskPosition: string | null = null;
let lastMaskHeight: string | null = null;
const SCROLL_DURATION = 600;
const THROTTLE_INTERVAL = 100;
const scrollToLineCenter = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
        return;
    }
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
    if (!rect) {
        return;
    }
    let scrollContainer: HTMLElement | null = null;
    let element: HTMLElement | null = range.startContainer instanceof HTMLElement ? range.startContainer : range.startContainer.parentElement;
    while (element && element !== document.body) {
        if (element.classList.contains('protyle-content')) {
            scrollContainer = element;
            break;
        }
        const overflowY = getComputedStyle(element).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
            scrollContainer = element;
        }
        element = element.parentElement;
    }
    if (!scrollContainer) {
        const protyleContents = document.querySelectorAll('.protyle-content');
        for (const pc of protyleContents) {
            const pcRect = pc.getBoundingClientRect();
            if (rect.top >= pcRect.top && rect.top <= pcRect.bottom) {
                scrollContainer = pc as HTMLElement;
                break;
            }
        }
    }
    if (!scrollContainer) {
        scrollContainer = document.documentElement;
    }
    const containerRect = scrollContainer.getBoundingClientRect();
    let targetOffset = containerRect.height / 2;
    const targetScrollTop = scrollContainer.scrollTop + rect.top - containerRect.top - targetOffset + (rect.height / 2);
    isScrolling = true;
    const startScrollTop = scrollContainer.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    const startTime = performance.now();
    const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / SCROLL_DURATION, 1);
        const easeProgress = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        scrollContainer.scrollTop = startScrollTop + distance * easeProgress;
        if (progress < 1) {
            rafId = requestAnimationFrame(animateScroll);
        } else {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                const currentRect = range.getClientRects()[0];
                if (currentRect) {
                    updateMaskPosition(currentRect, containerRect, scrollContainer);
                }
            }
            if (scrollTimeout !== null) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = window.setTimeout(() => {
                isScrolling = false;
                scrollTimeout = null;
            }, THROTTLE_INTERVAL);
        }
    };
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(animateScroll);
};
const updateMaskPosition = (cursorRect: DOMRect, containerRect: DOMRect, scrollContainer: HTMLElement) => {
    const cursorCenterY = cursorRect.top + cursorRect.height / 2;
    const containerTop = containerRect.top;
    const containerHeight = containerRect.height;
    const cursorRelativeY = cursorCenterY - containerTop;
    const positionPercent = (cursorRelativeY / containerHeight) * 100;
    const newMaskPosition = `${positionPercent}%`;
    const newMaskHeight = `${cursorRect.height * 0.75}px`;
    let textColor: string | null = null;
    const sel = window.getSelection();
    const focusNode = sel?.focusNode;
    if (focusNode) {
        if (focusNode.nodeType === Node.TEXT_NODE) {
            const parentElement = focusNode.parentElement;
            if (parentElement) {
                textColor = getComputedStyle(parentElement).color;
            }
        } else if (focusNode.nodeType === Node.ELEMENT_NODE) {
            textColor = getComputedStyle(focusNode as Element).color;
        }
    }
    if (!textColor) {
        textColor = getComputedStyle(scrollContainer).color;
    }
    if (lastMaskPosition !== newMaskPosition || lastMaskHeight !== newMaskHeight) {
        lastMaskPosition = newMaskPosition;
        lastMaskHeight = newMaskHeight;
        scrollContainer.style.setProperty('--asri-enhance-focus-mask-position', newMaskPosition);
        scrollContainer.style.setProperty('--asri-enhance-focus-mask-height', newMaskHeight);
    }
    if (textColor) {
        scrollContainer.style.setProperty('--asri-enhance-focus-text-color', textColor);
    }
};
const initTypewriterMode = () => {
    if (typewriterEventHandler) {
        document.removeEventListener("selectionchange", typewriterEventHandler);
        typewriterEventHandler = null;
    }
    typewriterEventHandler = () => {
        if (throttleTimeout !== null) {
            return;
        }
        throttleTimeout = window.setTimeout(() => {
            throttleTimeout = null;
        }, THROTTLE_INTERVAL);
        requestAnimationFrame(() => {
            scrollToLineCenter();
        });
    };
    document.addEventListener("selectionchange", typewriterEventHandler);
};
const destroyTypewriterMode = () => {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    if (scrollTimeout !== null) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
    }
    if (throttleTimeout !== null) {
        clearTimeout(throttleTimeout);
        throttleTimeout = null;
    }
    if (typewriterEventHandler) {
        document.removeEventListener("selectionchange", typewriterEventHandler);
        typewriterEventHandler = null;
    }
    isScrolling = false;
};
export async function onTypewriterModeClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
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
        destroyTypewriterMode();
    }
    else {
        htmlEl.setAttribute("data-asri-enhance-typewriter", "true");
        config[CONFIG_KEY] = true;
        initTypewriterMode();
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
export async function applyTypewriterModeConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-typewriter", "true");
        initTypewriterMode();
    }
    else {
        htmlEl.removeAttribute("data-asri-enhance-typewriter");
        destroyTypewriterMode();
    }
}
export { destroyTypewriterMode };
