import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-island-layout";
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
    }
    else {
        htmlEl.setAttribute("data-asri-enhance-island-layout", "true");
        config[CONFIG_KEY] = true;
        adjustMacTrafficLights();
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
function adjustMacTrafficLights(): void {
    if (document.body?.classList.contains("body--window")) {
        return;
    }
    const win = window as any;
    if (typeof window !== 'undefined' && win.process && win.require) {
        try {
            const { BrowserWindow } = win.require('@electron/remote');
            if (win.process.platform === 'darwin') {
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
    }
    else {
        htmlEl.removeAttribute("data-asri-enhance-island-layout");
    }
}
