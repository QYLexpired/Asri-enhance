import { Plugin } from "siyuan";
import { removeSugarConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const SUGAR_PALETTE_INFO: PaletteInfo = {
    name: "sugar",
    configKey: "asri-enhance-sugar",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-ocean",
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
export async function onSugarClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, SUGAR_PALETTE_INFO, event);
}
export async function applySugarConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, SUGAR_PALETTE_INFO, config);
}
export { removeSugarConfig };