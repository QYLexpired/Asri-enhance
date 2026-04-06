import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
import { removeFollowTimeConfig } from "../followtime/followtime";
const PALETTE_PREFIX = "asri-enhance-";
export const PALETTE_NAMES = [
    "amber",
    "sakura",
    "wilderness",
    "midnight",
    "ocean",
    "dusk",
    "twilight",
    "lavender",
    "opalite",
    "oxygen",
    "gingko",
] as const;
export type PaletteName = typeof PALETTE_NAMES[number];
export interface PaletteConfig {
    light: boolean;
    dark: boolean;
}
export interface PaletteInfo {
    name: string;
    configKey: string;
    otherConfigKeys: string[];
}
export function createPaletteInfo(name: PaletteName): PaletteInfo {
    return {
        name,
        configKey: `${PALETTE_PREFIX}${name}`,
        otherConfigKeys: PALETTE_NAMES
            .filter(n => n !== name)
            .map(n => `${PALETTE_PREFIX}${n}`),
    };
}
export async function removePaletteConfig(plugin: Plugin, palette: PaletteName, configFile: string = "config.json"): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl)
        return;
    const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
    if (htmlEl.classList.contains(`asri-palette-${palette}`)) {
        htmlEl.classList.remove(`asri-palette-${palette}`);
    }
    const config = await loadData(plugin, configFile);
    if (!config)
        return;
    const configKey = `${PALETTE_PREFIX}${palette}`;
    const paletteConfig = config[configKey];
    if (paletteConfig === undefined)
        return;
    if (typeof paletteConfig === "boolean") {
        delete config[configKey];
    }
    else if (paletteConfig && typeof paletteConfig === "object") {
        paletteConfig[themeMode] = false;
        config[configKey] = paletteConfig;
    }
    await saveData(plugin, configFile, config);
}
export async function clearAllPluginConfig(plugin: Plugin, configFile: string = "config.json"): Promise<void> {
    const config = await loadData(plugin, configFile);
    if (!config)
        return;
    let hasChanges = false;
    Object.keys(config).forEach((key) => {
        if (key.startsWith(PALETTE_PREFIX)) {
            delete config[key];
            hasChanges = true;
        }
    });
    if (hasChanges) {
        await saveData(plugin, configFile, config);
    }
}
export async function disableAllPalettesForCurrentTheme(plugin: Plugin, configFile: string = "config.json"): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl)
        return;
    const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
    const config = await loadData(plugin, configFile);
    if (!config)
        return;
    let hasChanges = false;
    PALETTE_NAMES.forEach((palette) => {
        const configKey = `${PALETTE_PREFIX}${palette}`;
        const paletteConfig = config[configKey];
        if (paletteConfig !== undefined) {
            if (typeof paletteConfig === "boolean") {
                delete config[configKey];
                hasChanges = true;
            }
            else if (paletteConfig && typeof paletteConfig === "object") {
                if (paletteConfig[themeMode] === true) {
                    paletteConfig[themeMode] = false;
                    config[configKey] = paletteConfig;
                    hasChanges = true;
                }
            }
        }
    });
    if (hasChanges) {
        await saveData(plugin, configFile, config);
    }
}
export async function onPaletteClick(plugin: Plugin, paletteInfo: PaletteInfo, _event?: MouseEvent): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl)
        return;
    const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
    const isActive = htmlEl.classList.contains(`asri-palette-${paletteInfo.name}`);
    if (isActive)
        return;
    const config = await loadData(plugin, "config.json") || {};
    const paletteConfig = config[paletteInfo.configKey] || { light: false, dark: false };
    const updateDOM = () => {
        Array.from(htmlEl.classList)
            .filter(cls => cls.startsWith("asri-palette-"))
            .forEach(cls => htmlEl.classList.remove(cls));
        htmlEl.classList.add(`asri-palette-${paletteInfo.name}`);
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
        if (config["asri-enhance-follow-time"]) {
            const followTimeConfig = config["asri-enhance-follow-time"];
            if (typeof followTimeConfig === "object") {
                followTimeConfig[themeMode] = false;
                config["asri-enhance-follow-time"] = followTimeConfig;
            }
            htmlEl.removeAttribute("data-asri-enhance-follow-time");
            removeFollowTimeConfig(plugin, "config.json").catch(() => {});
        }
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
    await saveData(plugin, "config.json", config).catch(() => {
    });
}
export async function applyPaletteConfig(plugin: Plugin, paletteInfo: PaletteInfo, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl)
        return;
    const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
    const configData = config !== undefined ? config : await loadData(plugin, "config.json");
    if (configData && configData[paletteInfo.configKey]) {
        const paletteConfig = configData[paletteInfo.configKey];
        const shouldApply = typeof paletteConfig === "boolean"
            ? paletteConfig
            : (paletteConfig[themeMode] === true);
        if (shouldApply) {
            Array.from(htmlEl.classList)
                .filter(cls => cls.startsWith("asri-palette-"))
                .forEach(cls => htmlEl.classList.remove(cls));
            htmlEl.classList.add(`asri-palette-${paletteInfo.name}`);
            htmlEl.removeAttribute("data-asri-enhance-follow-time");
        }
        else {
            htmlEl.classList.remove(`asri-palette-${paletteInfo.name}`);
        }
    }
}