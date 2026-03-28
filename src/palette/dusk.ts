import { Plugin } from "siyuan";
import { removeDuskConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const DUSK_PALETTE_INFO: PaletteInfo = {
    name: "dusk",
    configKey: "asri-enhance-dusk",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-ocean",
        "asri-enhance-salt",
        "asri-enhance-sugar",
        "asri-enhance-rosepine",
        "asri-enhance-topaz",
        "asri-enhance-oxygen",
        "asri-enhance-shade",
        "asri-enhance-gruvbox",
        "asri-enhance-glitch",
        "asri-enhance-nostalgia",
    ],
};
export async function onDuskClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, DUSK_PALETTE_INFO, event);
}
export async function applyDuskConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, DUSK_PALETTE_INFO, config);
}
export { removeDuskConfig };
