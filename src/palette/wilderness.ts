import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const WILDERNESS_PALETTE_INFO = createPaletteInfo("wilderness");
export async function onWildernessClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, WILDERNESS_PALETTE_INFO, event);
}
export async function applyWildernessConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, WILDERNESS_PALETTE_INFO, config);
}