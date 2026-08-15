import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const LAKESIDE_PALETTE_INFO = createPaletteInfo("lakeside");
export async function onLakesideClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, LAKESIDE_PALETTE_INFO, event);
}
export async function applyLakesideConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, LAKESIDE_PALETTE_INFO, config);
}
