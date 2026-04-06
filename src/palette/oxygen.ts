import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const OXYGEN_PALETTE_INFO = createPaletteInfo("oxygen");
export async function onOxygenClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, OXYGEN_PALETTE_INFO, event);
}
export async function applyOxygenConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, OXYGEN_PALETTE_INFO, config);
}