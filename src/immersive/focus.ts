import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-focus";
export async function onFocusModeClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute("data-asri-enhance-focus");
    const config = await loadData(plugin, CONFIG_FILE) || {};
    if (isActive) {
        htmlEl.removeAttribute("data-asri-enhance-focus");
        config[CONFIG_KEY] = false;
    }
    else {
        htmlEl.setAttribute("data-asri-enhance-focus", "true");
        config[CONFIG_KEY] = true;
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
export async function applyFocusModeConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-focus", "true");
    }
    else {
        htmlEl.removeAttribute("data-asri-enhance-focus");
    }
}
