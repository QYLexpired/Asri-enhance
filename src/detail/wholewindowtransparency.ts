import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-wholewindowtransparency";
const DATA_ATTR = "data-asri-enhance-wholewindowtransparency";
export async function onWholeWindowTransparencyClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute(DATA_ATTR);
    const config = (await loadData(plugin, CONFIG_FILE)) || {};
    if (isActive) {
        htmlEl.removeAttribute(DATA_ATTR);
        config[CONFIG_KEY] = false;
    }
    else {
        htmlEl.setAttribute(DATA_ATTR, "true");
        config[CONFIG_KEY] = true;
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
export async function applyWholeWindowTransparencyConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute(DATA_ATTR, "true");
    }
    else {
        htmlEl.removeAttribute(DATA_ATTR);
    }
}
