import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-windowtransparencyvalue";
const DATA_ATTR = "data-asri-enhance-windowtransparencyvalue";
export async function onWindowTransparencyValueClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
}
export async function applyWindowTransparencyValueConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    const value = configData?.[CONFIG_KEY];
    if (value !== undefined && value !== null) {
        htmlEl.setAttribute(DATA_ATTR, String(value));
    }
    else {
        htmlEl.removeAttribute(DATA_ATTR);
    }
}
export async function saveWindowTransparencyValue(plugin: Plugin, value: number): Promise<void> {
    const config = (await loadData(plugin, CONFIG_FILE)) || {};
    config[CONFIG_KEY] = value;
    await saveData(plugin, CONFIG_FILE, config);
    const htmlEl = document.documentElement;
    if (htmlEl) {
        htmlEl.setAttribute(DATA_ATTR, String(value));
    }
}
