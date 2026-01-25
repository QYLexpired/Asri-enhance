import { Plugin } from "siyuan";
import { removeWildernessConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const WILDERNESS_PALETTE_INFO: PaletteInfo = {
    name: "wilderness",
    configKey: "asri-enhance-wilderness",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-midnight",
        "asri-enhance-salt",
        "asri-enhance-rosepine",
        "asri-enhance-topaz",
        "asri-enhance-oxygen",
        "asri-enhance-shade",
        "asri-enhance-gruvbox",
        "asri-enhance-glitch",
        "asri-enhance-nostalgia",
    ],
};
export async function onWildernessClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, WILDERNESS_PALETTE_INFO, event);
}
export async function applyWildernessConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, WILDERNESS_PALETTE_INFO, config);
}
export { removeWildernessConfig };
