import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const LAVENDER_PALETTE_INFO = createPaletteInfo("lavender");
export async function onLavenderClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, LAVENDER_PALETTE_INFO, event);
}
export async function applyLavenderConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, LAVENDER_PALETTE_INFO, config);
}