import { Plugin } from "siyuan";
import { removeOceanConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const OCEAN_PALETTE_INFO: PaletteInfo = {
    name: "ocean",
    configKey: "asri-enhance-ocean",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-salt",
        "asri-enhance-sugar",
        "asri-enhance-dusk",
        "asri-enhance-twilight",
        "asri-enhance-rosepine",
        "asri-enhance-topaz",
        "asri-enhance-oxygen",
        "asri-enhance-shade",
        "asri-enhance-gruvbox",
        "asri-enhance-glitch",
        "asri-enhance-nostalgia",
    ],
};
export async function onOceanClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, OCEAN_PALETTE_INFO, event);
}
export async function applyOceanConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, OCEAN_PALETTE_INFO, config);
}
export { removeOceanConfig };