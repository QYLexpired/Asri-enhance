import { getFrontend, Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-card-layout";
const isMobile = () => {
    return getFrontend().endsWith("mobile");
};
class ProtyleFullscreenDetector {
    private hasFullscreen = false;
    private timer: ReturnType<typeof setTimeout> | null = null;
    private isActive = true;
    private onFullscreenChange: ((isFullscreen: boolean) => void) | null = null;
    start(onFullscreenChange?: (isFullscreen: boolean) => void) {
        this.onFullscreenChange = onFullscreenChange || null;
        this.check();
        document.addEventListener('visibilitychange', () => {
            this.isActive = document.visibilityState === 'visible';
            if (this.isActive) this.check();
        });
        const loop = () => {
            if (this.isActive) this.check();
            this.timer = setTimeout(loop, this.isActive ? 200 : 1000);
        };
        this.timer = setTimeout(loop, 200);
    }
    check() {
        const exists = document.querySelector('.fullscreen:not(.fn__none)') !== null;
        if (exists !== this.hasFullscreen) {
            this.hasFullscreen = exists;
            document.body.classList.toggle('asri-enhance-has-fullscreen', exists);
            this.onFullscreenChange?.(exists);
        }
    }
    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        if (this.hasFullscreen) {
            this.hasFullscreen = false;
            document.body.classList.remove('asri-enhance-has-fullscreen');
        }
    }
}
let fullscreenDetector: ProtyleFullscreenDetector | null = null;
let dockRightObserver: MutationObserver | null = null;
let dockLeftObserver: MutationObserver | null = null;
let dockRetryCount = 0;
const DOCK_RETRY_INTERVAL = 100;
const MAX_DOCK_RETRIES = 10;
function findDockElements(): { dockRight: Element | null; dockLeft: Element | null; toolbar: Element | null } {
    return {
        dockRight: document.querySelector("#dockRight"),
        dockLeft: document.querySelector("#dockLeft"),
        toolbar: document.querySelector("#toolbar"),
    };
}
function updateToolbarClasses(): void {
    const { dockRight, dockLeft, toolbar } = findDockElements();
    if (!toolbar) {
        return;
    }
    if (dockRight) {
        toolbar.classList.toggle("asri-enhance-dockr-expand", dockRight.classList.contains("dock-layout-expanded"));
        toolbar.classList.toggle("asri-enhance-dock-hidden", dockRight.classList.contains("fn__none"));
    } else {
        toolbar.classList.remove("asri-enhance-dockr-expand", "asri-enhance-dock-hidden");
    }
    if (dockLeft) {
        toolbar.classList.toggle("asri-enhance-dockl-expand", dockLeft.classList.contains("dock-layout-expanded"));
    } else {
        toolbar.classList.remove("asri-enhance-dockl-expand");
    }
}
function startDockObservers(): void {
    const { dockRight, dockLeft, toolbar } = findDockElements();
    if (!dockRight || !dockLeft) {
        if (dockRetryCount < MAX_DOCK_RETRIES) {
            dockRetryCount++;
            setTimeout(startDockObservers, DOCK_RETRY_INTERVAL);
        }
        return;
    }
    dockRetryCount = 0;
    if (!toolbar) {
        return;
    }
    updateToolbarClasses();
    dockRightObserver = new MutationObserver(() => {
        updateToolbarClasses();
    });
    dockRightObserver.observe(dockRight, {
        attributes: true,
        attributeFilter: ["class"],
    });
    dockLeftObserver = new MutationObserver(() => {
        updateToolbarClasses();
    });
    dockLeftObserver.observe(dockLeft, {
        attributes: true,
        attributeFilter: ["class"],
    });
}
export async function onCardLayoutClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
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
    const isActive = htmlEl.hasAttribute("data-asri-enhance-card-layout");
    const config = await loadData(plugin, CONFIG_FILE) || {};
    if (isActive) {
        htmlEl.removeAttribute("data-asri-enhance-card-layout");
        config[CONFIG_KEY] = false;
        restoreMacTrafficLights();
        fullscreenDetector?.stop();
        fullscreenDetector = null;
        stopDockObservers();
    }
    else {
        htmlEl.setAttribute("data-asri-enhance-card-layout", "true");
        config[CONFIG_KEY] = true;
        adjustMacTrafficLights();
        fullscreenDetector = new ProtyleFullscreenDetector();
        fullscreenDetector.start((isFullscreen) => {
            if (document.body?.classList.contains("body--window")) {
                return;
            }
            if (isFullscreen) {
                restoreMacTrafficLights();
            } else {
                adjustMacTrafficLights();
            }
        });
        startDockObservers();
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
function adjustMacTrafficLights(): void {
    const win = window as any;
    if (typeof window !== 'undefined' && win.process && win.require) {
        try {
            const { BrowserWindow } = win.require('@electron/remote');
            if (win.process.platform === 'darwin') {
                if (document.body?.classList.contains("body--window")) {
                    return;
                }
                BrowserWindow.getFocusedWindow()?.setWindowButtonPosition({ x: 16, y: 24 });
            }
        } catch (e) {
        }
    }
}
export function restoreMacTrafficLights(): void {
    const win = window as any;
    if (typeof window !== 'undefined' && win.process && win.require) {
        try {
            const { BrowserWindow } = win.require('@electron/remote');
            if (win.process.platform === 'darwin') {
                BrowserWindow.getFocusedWindow()?.setWindowButtonPosition({ x: 16, y: 16 });
            }
        } catch (e) {
        }
    }
}
export async function applyCardLayoutConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    if (isMobile()) {
        return;
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-card-layout", "true");
        adjustMacTrafficLights();
        fullscreenDetector = new ProtyleFullscreenDetector();
        fullscreenDetector.start((isFullscreen) => {
            if (document.body?.classList.contains("body--window")) {
                return;
            }
            if (isFullscreen) {
                restoreMacTrafficLights();
            } else {
                adjustMacTrafficLights();
            }
        });
        startDockObservers();
    }
    else {
        htmlEl.removeAttribute("data-asri-enhance-card-layout");
        stopDockObservers();
    }
}
export function stopDockObservers(): void {
    if (dockRightObserver) {
        dockRightObserver.disconnect();
        dockRightObserver = null;
    }
    if (dockLeftObserver) {
        dockLeftObserver.disconnect();
        dockLeftObserver = null;
    }
    dockRetryCount = 0;
}
