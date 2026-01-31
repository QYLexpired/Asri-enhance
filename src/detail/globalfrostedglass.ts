import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-global-frosted-glass";
export async function onGlobalFrostedGlassClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute("data-asri-enhance-global-frosted-glass");
    const config = await loadData(plugin, CONFIG_FILE) || {};
    if (isActive) {
        htmlEl.removeAttribute("data-asri-enhance-global-frosted-glass");
        config[CONFIG_KEY] = false;
    } else {
        htmlEl.setAttribute("data-asri-enhance-global-frosted-glass", "true");
        config[CONFIG_KEY] = true;
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => { });
}
export async function applyGlobalFrostedGlassConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-global-frosted-glass", "true");
    } else {
        htmlEl.removeAttribute("data-asri-enhance-global-frosted-glass");
    }
}
