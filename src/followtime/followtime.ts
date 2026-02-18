import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
import { PaletteConfig } from "../palette/manager";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-follow-time";
const DATA_ATTR = "data-asri-enhance-follow-time";
export async function onFollowTimeClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute(DATA_ATTR);
    if (isActive) {
        return;
    }
    const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
    const config = (await loadData(plugin, CONFIG_FILE)) || {};
    const followTimeConfig = config[CONFIG_KEY] || { light: false, dark: false };
    const updateDOM = () => {
        htmlEl.setAttribute(DATA_ATTR, "true");
        htmlEl.removeAttribute("data-asri-palette");
        followTimeConfig[themeMode] = true;
        config[CONFIG_KEY] = followTimeConfig;
    };
    if (document.startViewTransition) {
        const transition = document.startViewTransition(() => {
            updateDOM();
        });
        await transition.finished.catch(() => {
        });
    }
    else {
        updateDOM();
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
export async function applyFollowTimeConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY]) {
        const followTimeConfig = configData[CONFIG_KEY];
        const shouldApply = typeof followTimeConfig === "boolean"
            ? followTimeConfig
            : (followTimeConfig[themeMode] === true);
        if (shouldApply) {
            htmlEl.setAttribute(DATA_ATTR, "true");
            htmlEl.removeAttribute("data-asri-palette");
        }
        else {
            htmlEl.removeAttribute(DATA_ATTR);
        }
    }
    else {
        htmlEl.removeAttribute(DATA_ATTR);
    }
}
export async function removeFollowTimeConfig(plugin: Plugin, configFile: string = "config.json"): Promise<void> {
    const htmlEl = document.documentElement;
    if (htmlEl) {
        htmlEl.removeAttribute(DATA_ATTR);
    }
    const config = await loadData(plugin, configFile);
    if (!config) {
        return;
    }
    if (config[CONFIG_KEY] !== undefined) {
        delete config[CONFIG_KEY];
        await saveData(plugin, configFile, config);
    }
}
