import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const VIOLET_PALETTE_INFO = createPaletteInfo("violet");
export async function onVioletClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, VIOLET_PALETTE_INFO, event);
}
export async function applyVioletConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, VIOLET_PALETTE_INFO, config);
}
