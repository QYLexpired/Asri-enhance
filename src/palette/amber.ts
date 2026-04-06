import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const AMBER_PALETTE_INFO = createPaletteInfo("amber");
export async function onAmberClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, AMBER_PALETTE_INFO, event);
}
export async function applyAmberConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, AMBER_PALETTE_INFO, config);
}