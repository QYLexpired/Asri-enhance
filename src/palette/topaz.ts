import { Plugin } from "siyuan";
import { removeTopazConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const TOPAZ_PALETTE_INFO: PaletteInfo = {
    name: "topaz",
    configKey: "asri-enhance-topaz",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-salt",
        "asri-enhance-rosepine",
        "asri-enhance-oxygen",
        "asri-enhance-shade",
        "asri-enhance-gruvbox",
        "asri-enhance-glitch",
    ],
};
export async function onTopazClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, TOPAZ_PALETTE_INFO, event);
}
export async function applyTopazConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, TOPAZ_PALETTE_INFO, config);
}
export { removeTopazConfig };
