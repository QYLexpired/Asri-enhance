import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const OPALITE_PALETTE_INFO = createPaletteInfo("opalite");
export async function onOpaliteClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, OPALITE_PALETTE_INFO, event);
}
export async function applyOpaliteConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, OPALITE_PALETTE_INFO, config);
}