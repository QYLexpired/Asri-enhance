import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const OCEAN_PALETTE_INFO = createPaletteInfo("ocean");
export async function onOceanClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, OCEAN_PALETTE_INFO, event);
}
export async function applyOceanConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, OCEAN_PALETTE_INFO, config);
}