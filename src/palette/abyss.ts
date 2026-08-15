import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const ABYSS_PALETTE_INFO = createPaletteInfo("abyss");
export async function onAbyssClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, ABYSS_PALETTE_INFO, event);
}
export async function applyAbyssConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, ABYSS_PALETTE_INFO, config);
}
