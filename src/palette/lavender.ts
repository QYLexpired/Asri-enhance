import { Plugin } from "siyuan";
import { removeLavenderConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const LAVENDER_PALETTE_INFO: PaletteInfo = {
    name: "lavender",
    configKey: "asri-enhance-lavender",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-ocean",
        "asri-enhance-dusk",
        "asri-enhance-twilight",
        "asri-enhance-opalite",
        "asri-enhance-oxygen",
        "asri-enhance-gingko",
    ],
};
export async function onLavenderClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, LAVENDER_PALETTE_INFO, event);
}
export async function applyLavenderConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, LAVENDER_PALETTE_INFO, config);
}
export { removeLavenderConfig };
