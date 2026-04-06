import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const GINGKO_PALETTE_INFO = createPaletteInfo("gingko");
export async function onGingkoClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, GINGKO_PALETTE_INFO, event);
}
export async function applyGingkoConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, GINGKO_PALETTE_INFO, config);
}