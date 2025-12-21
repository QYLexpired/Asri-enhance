import { Plugin } from "siyuan";
import { removeGruvboxConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const GRUVBOX_PALETTE_INFO: PaletteInfo = {
    name: "gruvbox",
    configKey: "asri-enhance-gruvbox",
    otherConfigKeys: [
        "asri-enhance-sakura",
        "asri-enhance-amber",
        "asri-enhance-wilderness",
        "asri-enhance-midnight",
        "asri-enhance-salt",
        "asri-enhance-rosepine",
        "asri-enhance-topaz",
        "asri-enhance-oxygen",
        "asri-enhance-shade",
        "asri-enhance-glitch",
    ],
};
export async function onGruvboxClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, GRUVBOX_PALETTE_INFO, event);
}
export async function applyGruvboxConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, GRUVBOX_PALETTE_INFO, config);
}
export { removeGruvboxConfig };
