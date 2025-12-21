import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
export interface PaletteConfig {
    light: boolean;
    dark: boolean;
}
export interface PaletteInfo {
    name: string;
    configKey: string;
    otherConfigKeys: string[];
}
export async function onPaletteClick(plugin: Plugin, paletteInfo: PaletteInfo, _event?: MouseEvent): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl)
        return;
    const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
    const isActive = htmlEl.getAttribute("data-asri-palette") === paletteInfo.name;
    if (isActive)
        return;
    const config = await loadData(plugin, CONFIG_FILE) || {};
    const paletteConfig = config[paletteInfo.configKey] || { light: false, dark: false };
    const updateDOM = () => {
        htmlEl.removeAttribute("data-asri-palette");
        htmlEl.setAttribute("data-asri-palette", paletteInfo.name);
        paletteConfig[themeMode] = true;
        for (const otherKey of paletteInfo.otherConfigKeys) {
            if (config[otherKey]) {
                const otherConfig = config[otherKey];
                if (typeof otherConfig === "object") {
                    otherConfig[themeMode] = false;
                    config[otherKey] = otherConfig;
                }
            }
        }
        config[paletteInfo.configKey] = paletteConfig;
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
export async function applyPaletteConfig(plugin: Plugin, paletteInfo: PaletteInfo, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl)
        return;
    const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[paletteInfo.configKey]) {
        const paletteConfig = configData[paletteInfo.configKey];
        const shouldApply = typeof paletteConfig === "boolean"
            ? paletteConfig
            : (paletteConfig[themeMode] === true);
        if (shouldApply) {
            htmlEl.removeAttribute("data-asri-palette");
            htmlEl.setAttribute("data-asri-palette", paletteInfo.name);
        }
        else {
            if (htmlEl.getAttribute("data-asri-palette") === paletteInfo.name) {
                htmlEl.removeAttribute("data-asri-palette");
            }
        }
    }
}
