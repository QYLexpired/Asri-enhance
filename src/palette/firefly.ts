import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const FIREFLY_PALETTE_INFO = createPaletteInfo("firefly");
export async function onFireflyClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, FIREFLY_PALETTE_INFO, event);
}
export async function applyFireflyConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, FIREFLY_PALETTE_INFO, config);
}
