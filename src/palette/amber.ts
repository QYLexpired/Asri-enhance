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
        "asri-enhance-ocean",
        "asri-enhance-dusk",
        "asri-enhance-twilight",
        "asri-enhance-lavender",
        "asri-enhance-opalite",
        "asri-enhance-oxygen",
        "asri-enhance-gingko",
    ],
};
export async function onAmberClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, AMBER_PALETTE_INFO, event);
}
export async function applyAmberConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, AMBER_PALETTE_INFO, config);
}
export { removeAmberConfig };
