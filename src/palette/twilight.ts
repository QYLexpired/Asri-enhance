import { Plugin } from "siyuan";
import { removeTwilightConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const TWILIGHT_PALETTE_INFO: PaletteInfo = {
    name: "twilight",
    configKey: "asri-enhance-twilight",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-ocean",
        "asri-enhance-dusk",
        "asri-enhance-rosepine",
        "asri-enhance-topaz",
        "asri-enhance-oxygen",
        "asri-enhance-gruvbox",
        "asri-enhance-glitch",
    ],
};
export async function onTwilightClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, TWILIGHT_PALETTE_INFO, event);
}
export async function applyTwilightConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, TWILIGHT_PALETTE_INFO, config);
}
export { removeTwilightConfig };
