import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-disable-window-transparency";
const DATA_ATTR = "data-asri-enhance-disable-window-transparency";
export async function onDisableWindowTransparencyClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const bodyEl = document.body;
    if (!bodyEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute(DATA_ATTR);
    const config = (await loadData(plugin, CONFIG_FILE)) || {};
    if (isActive) {
        htmlEl.removeAttribute(DATA_ATTR);
        bodyEl.classList.add("asri-vibrancy");
        config[CONFIG_KEY] = false;
    }
    else {
        htmlEl.setAttribute(DATA_ATTR, "true");
        setTimeout(() => {
            bodyEl.classList.remove("asri-vibrancy");
        }, 200);
        config[CONFIG_KEY] = true;
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
export async function applyDisableWindowTransparencyConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const bodyEl = document.body;
    if (!bodyEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute(DATA_ATTR, "true");
        setTimeout(() => {
            bodyEl.classList.remove("asri-vibrancy");
        }, 200);
    }
    else {
        htmlEl.removeAttribute(DATA_ATTR);
        bodyEl.classList.add("asri-vibrancy");
    }
}
