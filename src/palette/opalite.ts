import { Plugin } from "siyuan";
import { removeOpaliteConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const OPALITE_PALETTE_INFO: PaletteInfo = {
    name: "opalite",
    configKey: "asri-enhance-opalite",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-ocean",
        "asri-enhance-dusk",
        "asri-enhance-twilight",
        "asri-enhance-rosepine",
        "asri-enhance-oxygen",
        "asri-enhance-gingko",
        "asri-enhance-glitch",
    ],
};
export async function onOpaliteClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, OPALITE_PALETTE_INFO, event);
}
export async function applyOpaliteConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, OPALITE_PALETTE_INFO, config);
}
export { removeOpaliteConfig };
