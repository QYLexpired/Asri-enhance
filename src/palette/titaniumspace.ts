import { Plugin } from "siyuan";
import { createPaletteInfo } from "./manager";
import { onPaletteClick, applyPaletteConfig } from "./manager";
const TITANIUMSPACE_PALETTE_INFO = createPaletteInfo("titaniumspace");
export async function onTitaniumspaceClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    return onPaletteClick(plugin, TITANIUMSPACE_PALETTE_INFO, event);
}
export async function applyTitaniumspaceConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    return applyPaletteConfig(plugin, TITANIUMSPACE_PALETTE_INFO, config);
}
