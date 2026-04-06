import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const TWILIGHT_PALETTE_INFO = createPaletteInfo("twilight");
export async function onTwilightClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, TWILIGHT_PALETTE_INFO, event);
}
export async function applyTwilightConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, TWILIGHT_PALETTE_INFO, config);
}