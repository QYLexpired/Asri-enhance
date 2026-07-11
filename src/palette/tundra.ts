import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const TUNDRA_PALETTE_INFO = createPaletteInfo("tundra");
export async function onTundraClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, TUNDRA_PALETTE_INFO, event);
}
export async function applyTundraConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, TUNDRA_PALETTE_INFO, config);
}
