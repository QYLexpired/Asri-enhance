import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-island-layout";
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
        const exists = document.querySelector('.protyle.fullscreen:not(.fn__none)') !== null;
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
export async function onIslandLayoutClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute("data-asri-enhance-island-layout");
    const config = await loadData(plugin, CONFIG_FILE) || {};
    if (isActive) {
        htmlEl.removeAttribute("data-asri-enhance-island-layout");
        config[CONFIG_KEY] = false;
        restoreMacTrafficLights();
        fullscreenDetector?.stop();
        fullscreenDetector = null;
    }
    else {
        htmlEl.setAttribute("data-asri-enhance-island-layout", "true");
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
export async function applyIslandLayoutConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-island-layout", "true");
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
    }
    else {
        htmlEl.removeAttribute("data-asri-enhance-island-layout");
    }
}
