import { Plugin } from "siyuan";
import { removeAmberConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const AMBER_PALETTE_INFO: PaletteInfo = {
    name: "amber",
    configKey: "asri-enhance-amber",
    otherConfigKeys: [
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
        "asri-enhance-nostalgia",
    ],
};
export async function onAmberClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, AMBER_PALETTE_INFO, event);
}
export async function applyAmberConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, AMBER_PALETTE_INFO, config);
}
export { removeAmberConfig };
