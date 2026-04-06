import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const DUSK_PALETTE_INFO = createPaletteInfo("dusk");
export async function onDuskClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, DUSK_PALETTE_INFO, event);
}
export async function applyDuskConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, DUSK_PALETTE_INFO, config);
}