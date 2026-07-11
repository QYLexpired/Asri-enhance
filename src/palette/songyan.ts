import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const SONGYAN_PALETTE_INFO = createPaletteInfo("songyan");
export async function onSongyanClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, SONGYAN_PALETTE_INFO, event);
}
export async function applySongyanConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, SONGYAN_PALETTE_INFO, config);
}
