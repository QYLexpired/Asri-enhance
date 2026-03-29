import { Plugin } from "siyuan";
import { removeGlitchConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const GLITCH_PALETTE_INFO: PaletteInfo = {
    name: "glitch",
    configKey: "asri-enhance-glitch",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-ocean",
        "asri-enhance-dusk",
        "asri-enhance-twilight",
        "asri-enhance-rosepine",
        "asri-enhance-opalite",
        "asri-enhance-oxygen",
        "asri-enhance-gingko",
    ],
};
export async function onGlitchClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, GLITCH_PALETTE_INFO, event);
}
export async function applyGlitchConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, GLITCH_PALETTE_INFO, config);
}
export { removeGlitchConfig };
