import { Plugin } from "siyuan";
import { removeShadeConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const SHADE_PALETTE_INFO: PaletteInfo = {
	name: "shade",
	configKey: "asri-enhance-shade",
	otherConfigKeys: [
		"asri-enhance-amber",
		"asri-enhance-wilderness",
		"asri-enhance-midnight",
		"asri-enhance-salt",
		"asri-enhance-rosepine",
		"asri-enhance-topaz",
		"asri-enhance-oxygen",
	],
};
export async function onShadeClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
	return onPaletteClick(plugin, SHADE_PALETTE_INFO, event);
}
export async function applyShadeConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
	return applyPaletteConfig(plugin, SHADE_PALETTE_INFO, config);
}
export { removeShadeConfig };
