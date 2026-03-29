import { Plugin } from "siyuan";
import { removeSakuraConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const SAKURA_PALETTE_INFO: PaletteInfo = {
    name: "sakura",
    configKey: "asri-enhance-sakura",
    otherConfigKeys: [
        "asri-enhance-amber",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-ocean",
        "asri-enhance-dusk",
        "asri-enhance-twilight",
        "asri-enhance-rosepine",
        "asri-enhance-topaz",
        "asri-enhance-oxygen",
        "asri-enhance-gruvbox",
        "asri-enhance-glitch",
    ],
};
export async function onSakuraClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, SAKURA_PALETTE_INFO, event);
}
export async function applySakuraConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, SAKURA_PALETTE_INFO, config);
}
export { removeSakuraConfig };
