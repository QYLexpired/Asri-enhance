import { Plugin } from "siyuan";
import { removeMidnightConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const MIDNIGHT_PALETTE_INFO: PaletteInfo = {
    name: "midnight",
    configKey: "asri-enhance-midnight",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-wilderness",
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
export async function onMidnightClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, MIDNIGHT_PALETTE_INFO, event);
}
export async function applyMidnightConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, MIDNIGHT_PALETTE_INFO, config);
}
export { removeMidnightConfig };
