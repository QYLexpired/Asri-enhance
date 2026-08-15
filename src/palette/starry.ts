import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const STARRY_PALETTE_INFO = createPaletteInfo("starry");
export async function onStarryClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, STARRY_PALETTE_INFO, event);
}
export async function applyStarryConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, STARRY_PALETTE_INFO, config);
}
