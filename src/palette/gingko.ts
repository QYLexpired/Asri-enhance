import { Plugin } from "siyuan";
import { removeGingkoConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const GINGKO_PALETTE_INFO: PaletteInfo = {
    name: "gingko",
    configKey: "asri-enhance-gingko",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-ocean",
        "asri-enhance-dusk",
        "asri-enhance-twilight",
        "asri-enhance-lavender",
        "asri-enhance-opalite",
        "asri-enhance-oxygen",
    ],
};
export async function onGingkoClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, GINGKO_PALETTE_INFO, event);
}
export async function applyGingkoConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, GINGKO_PALETTE_INFO, config);
}
export { removeGingkoConfig };
