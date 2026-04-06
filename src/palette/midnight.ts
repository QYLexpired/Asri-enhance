import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const MIDNIGHT_PALETTE_INFO = createPaletteInfo("midnight");
export async function onMidnightClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, MIDNIGHT_PALETTE_INFO, event);
}
export async function applyMidnightConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, MIDNIGHT_PALETTE_INFO, config);
}