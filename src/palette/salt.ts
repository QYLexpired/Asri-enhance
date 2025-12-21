import { Plugin } from "siyuan";
import { removeSaltConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const SALT_PALETTE_INFO: PaletteInfo = {
    name: "salt",
    configKey: "asri-enhance-salt",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-rosepine",
        "asri-enhance-topaz",
        "asri-enhance-oxygen",
        "asri-enhance-shade",
        "asri-enhance-gruvbox",
        "asri-enhance-glitch",
    ],
};
export async function onSaltClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, SALT_PALETTE_INFO, event);
}
export async function applySaltConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, SALT_PALETTE_INFO, config);
}
export { removeSaltConfig };
