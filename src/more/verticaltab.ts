import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
import { createFetchInterceptor } from "../utils/fetchInterceptor";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-vertical-tab";
const DEFAULT_WIDTH = 150;
let currentPlugin: Plugin | null = null;
let isUpdating = false;
let isDragging = false;
let dragStartX = 0;
let dragStartWidth = 0;
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
let mouseUpHandler: (() => void) | null = null;
let rafId: number | null = null;
let pendingWidth: number | null = null;
let currentTopLeftElement: HTMLElement | null = null;
let toolbarElement: HTMLElement | null = null;
let fetchInterceptorDisconnect: (() => void) | null = null;
function findLayoutCenter(maxRetries: number = 10, interval: number = 100): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
        let attempts = 0;
        const tryFind = () => {
            const center = document.querySelector(".layout__center") as HTMLElement;
            if (center) {
                resolve(center);
                return;
            }
            attempts++;
            if (attempts >= maxRetries) {
                resolve(null);
                return;
            }
            setTimeout(tryFind, interval);
        };
        tryFind();
    });
}
function getCurrentWidth(): number {
    const htmlEl = document.documentElement;
    const widthStr = getComputedStyle(htmlEl).getPropertyValue("--asri-enhance-vertical-tab-width");
    if (widthStr) {
        const width = parseFloat(widthStr);
        return isNaN(width) ? DEFAULT_WIDTH : width;
    }
    return DEFAULT_WIDTH;
}
function setWidth(width: number): void {
    const htmlEl = document.documentElement;
    htmlEl.style.setProperty("--asri-enhance-vertical-tab-width", `${width}px`);
}
function resetWidth(): void {
    setWidth(DEFAULT_WIDTH);
}
function cleanupEventListeners(): void {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    pendingWidth = null;
    if (mouseMoveHandler) {
        document.removeEventListener("mousemove", mouseMoveHandler);
        mouseMoveHandler = null;
    }
    if (mouseUpHandler) {
        document.removeEventListener("mouseup", mouseUpHandler);
        mouseUpHandler = null;
    }
    isDragging = false;
}
function setupResizeElement(resizeElement: HTMLElement): void {
    const mousedownHandler = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
        dragStartX = e.clientX;
        dragStartWidth = getCurrentWidth();
        document.body.style.userSelect = "none";
        document.body.style.cursor = "col-resize";
        mouseMoveHandler = (moveEvent: MouseEvent) => {
            if (!isDragging)
                return;
            moveEvent.preventDefault();
            const deltaX = moveEvent.clientX - dragStartX;
            const newWidth = Math.max(100, Math.min(300, dragStartWidth + deltaX));
            pendingWidth = newWidth;
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(() => {
                if (pendingWidth !== null) {
                    setWidth(pendingWidth);
                    pendingWidth = null;
                }
                rafId = null;
            });
        };
        mouseUpHandler = () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = "";
                document.body.style.cursor = "";
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                if (pendingWidth !== null) {
                    setWidth(pendingWidth);
                    pendingWidth = null;
                }
                if (mouseMoveHandler) {
                    document.removeEventListener("mousemove", mouseMoveHandler);
                    mouseMoveHandler = null;
                }
                if (mouseUpHandler) {
                    document.removeEventListener("mouseup", mouseUpHandler);
                    mouseUpHandler = null;
                }
            }
        };
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
    };
    const dblclickHandler = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        resetWidth();
    };
    const oldMousedownHandler = (resizeElement as any).__asriMousedownHandler;
    const oldDblclickHandler = (resizeElement as any).__asriDblclickHandler;
    if (oldMousedownHandler) {
        resizeElement.removeEventListener("mousedown", oldMousedownHandler);
    }
    if (oldDblclickHandler) {
        resizeElement.removeEventListener("dblclick", oldDblclickHandler);
    }
    (resizeElement as any).__asriMousedownHandler = mousedownHandler;
    (resizeElement as any).__asriDblclickHandler = dblclickHandler;
    resizeElement.addEventListener("mousedown", mousedownHandler);
    resizeElement.addEventListener("dblclick", dblclickHandler);
}
function addClassToTopLeftWnd(center: HTMLElement): void {
    if (isUpdating) {
        return;
    }
    const wndElements = center.querySelectorAll('[data-type="wnd"]') as NodeListOf<HTMLElement>;
    if (wndElements.length === 0) {
        return;
    }
    let topLeftElement: HTMLElement | null = null;
    let minTop = Infinity;
    let minLeft = Infinity;
    wndElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top;
        const left = rect.left;
        if (top < minTop || (top === minTop && left < minLeft)) {
            minTop = top;
            minLeft = left;
            topLeftElement = el;
        }
    });
    isUpdating = true;
    wndElements.forEach((el) => {
        if (el !== topLeftElement) {
            el.classList.remove("asri-enhance-verticaltab");
            el.classList.remove("asri-enhance-verticaltab-toponly");
            el.classList.remove("asri-enhance-verticaltab-dockr-expand-spacing");
            const resizeElement = el.querySelector(".layout__resize.layout__resize--lr.asri-enhance-verticaltab-resize");
            if (resizeElement) {
                resizeElement.remove();
            }
        }
    });
    if (topLeftElement) {
        const shouldAddClass = !topLeftElement.classList.contains("asri-enhance-verticaltab");
        if (shouldAddClass) {
            topLeftElement.classList.add("asri-enhance-verticaltab");
        }
        currentTopLeftElement = topLeftElement;
        const topLeftRect = topLeftElement.getBoundingClientRect();
        const topLeftTop = topLeftRect.top;
        const tolerance = 1;
        let hasSameTop = false;
        wndElements.forEach((el) => {
            if (el !== topLeftElement) {
                const rect = el.getBoundingClientRect();
                if (Math.abs(rect.top - topLeftTop) <= tolerance) {
                    hasSameTop = true;
                }
            }
        });
        if (!hasSameTop) {
            topLeftElement.classList.add("asri-enhance-verticaltab-toponly");
        }
        else {
            topLeftElement.classList.remove("asri-enhance-verticaltab-toponly");
        }
        const firstFlex = Array.from(topLeftElement.children).find((child) => child.classList.contains("fn__flex")) as HTMLElement;
        if (firstFlex && firstFlex.parentElement) {
            let resizeElement = firstFlex.parentElement.querySelector(".layout__resize.layout__resize--lr.asri-enhance-verticaltab-resize") as HTMLElement;
            if (!resizeElement) {
                resizeElement = document.createElement("div");
                resizeElement.className = "layout__resize layout__resize--lr asri-enhance-verticaltab-resize";
                firstFlex.parentElement.insertBefore(resizeElement, firstFlex.nextSibling);
            }
            setupResizeElement(resizeElement);
        }
        updateSpacingClass(topLeftElement);
    }
    isUpdating = false;
}
function getTopbarRightSpacing(): number {
    const targetToolbar = toolbarElement ?? (document.querySelector("#toolbar") as HTMLElement | null);
    if (!targetToolbar) {
        return 0;
    }
    toolbarElement = targetToolbar;
    const spacingStr = getComputedStyle(targetToolbar).getPropertyValue("--topbar-right-spacing");
    if (!spacingStr) {
        return 0;
    }
    const spacing = parseFloat(spacingStr);
    return isNaN(spacing) ? 0 : spacing;
}
function updateSpacingClass(targetElement?: HTMLElement): void {
    const target = targetElement ?? currentTopLeftElement;
    if (!target) {
        return;
    }
    const center = document.querySelector(".layout__center") as HTMLElement;
    if (!center) {
        return;
    }
    const dockrExpanded = document.querySelector(".layout__dockr > .fn__flex:not(.fn__none)") !== null;
    if (dockrExpanded) {
        center.classList.remove("asri-enhance-dockr-fold");
    }
    else {
        center.classList.add("asri-enhance-dockr-fold");
    }
    const hasSpacing = getTopbarRightSpacing() > 0;
    if (hasSpacing) {
        target.classList.add("asri-enhance-verticaltab-dockr-expand-spacing");
    }
    else {
        target.classList.remove("asri-enhance-verticaltab-dockr-expand-spacing");
    }
}
async function startObserver(): Promise<void> {
    const center = await findLayoutCenter();
    if (!center) {
        return;
    }
    setWidth(DEFAULT_WIDTH);
    addClassToTopLeftWnd(center);
    if (!fetchInterceptorDisconnect) {
        try {
            const interceptor = createFetchInterceptor("setUILayout", () => {
                const centerEl = document.querySelector(".layout__center") as HTMLElement | null;
                if (centerEl) {
                    queueMicrotask(() => {
                        try {
                            addClassToTopLeftWnd(centerEl);
                            updateSpacingClass();
                        }
                        catch (err) {
                        }
                    });
                }
            });
            fetchInterceptorDisconnect = () => {
                try {
                    interceptor.disconnect();
                }
                catch (err) {
                }
                fetchInterceptorDisconnect = null;
            };
        }
        catch (err) {
        }
    }
}
export function stopObserver(): void {
    if (fetchInterceptorDisconnect) {
        try {
            fetchInterceptorDisconnect();
        }
        catch (err) {
        }
        fetchInterceptorDisconnect = null;
    }
    const center = document.querySelector(".layout__center") as HTMLElement;
    if (center) {
        center.classList.remove("asri-enhance-dockr-fold");
    }
    const allWndElements = document.querySelectorAll('[data-type="wnd"]') as NodeListOf<HTMLElement>;
    allWndElements.forEach((el) => {
        el.classList.remove("asri-enhance-verticaltab");
        el.classList.remove("asri-enhance-verticaltab-toponly");
        el.classList.remove("asri-enhance-verticaltab-dockr-expand-spacing");
        const resizeElement = el.querySelector(".layout__resize.layout__resize--lr.asri-enhance-verticaltab-resize") as HTMLElement;
        if (resizeElement) {
            const mousedownHandler = (resizeElement as any).__asriMousedownHandler;
            const dblclickHandler = (resizeElement as any).__asriDblclickHandler;
            if (mousedownHandler) {
                resizeElement.removeEventListener("mousedown", mousedownHandler);
                delete (resizeElement as any).__asriMousedownHandler;
            }
            if (dblclickHandler) {
                resizeElement.removeEventListener("dblclick", dblclickHandler);
                delete (resizeElement as any).__asriDblclickHandler;
            }
            resizeElement.remove();
        }
    });
    const htmlEl = document.documentElement;
    if (htmlEl) {
        htmlEl.style.removeProperty("--asri-enhance-vertical-tab-width");
    }
    isUpdating = false;
    currentTopLeftElement = null;
}
export async function onVerticalTabClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    currentPlugin = plugin;
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute("data-asri-enhance-vertical-tab");
    const config = await loadData(plugin, CONFIG_FILE) || {};
    if (isActive) {
        htmlEl.removeAttribute("data-asri-enhance-vertical-tab");
        config[CONFIG_KEY] = false;
        stopObserver();
    }
    else {
        htmlEl.setAttribute("data-asri-enhance-vertical-tab", "true");
        config[CONFIG_KEY] = true;
        startObserver().catch(() => { });
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
export async function applyVerticalTabConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    currentPlugin = plugin;
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-vertical-tab", "true");
        startObserver().catch(() => { });
    }
    else {
        htmlEl.removeAttribute("data-asri-enhance-vertical-tab");
        stopObserver();
    }
}
