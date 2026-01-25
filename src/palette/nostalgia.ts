import { Plugin } from "siyuan";
import { removeNostalgiaConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const NOSTALGIA_PALETTE_INFO: PaletteInfo = {
    name: "nostalgia",
    configKey: "asri-enhance-nostalgia",
    otherConfigKeys: [
        "asri-enhance-amber",
        "asri-enhance-sakura",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-salt",
        "asri-enhance-rosepine",
        "asri-enhance-topaz",
        "asri-enhance-oxygen",
        "asri-enhance-shade",
        "asri-enhance-gruvbox",
        "asri-enhance-glitch",
    ],
};
export async function onNostalgiaClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, NOSTALGIA_PALETTE_INFO, event);
}
export async function applyNostalgiaConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, NOSTALGIA_PALETTE_INFO, config);
}
export { removeNostalgiaConfig };
