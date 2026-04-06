import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const SAKURA_PALETTE_INFO = createPaletteInfo("sakura");
export async function onSakuraClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, SAKURA_PALETTE_INFO, event);
}
export async function applySakuraConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, SAKURA_PALETTE_INFO, config);
}