import { Plugin } from "siyuan";
import { removeTopazConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const TOPAZ_PALETTE_INFO: PaletteInfo = {
	name: "topaz",
	configKey: "asri-enhance-topaz",
	otherConfigKeys: [
		"asri-enhance-amber",
		"asri-enhance-wilderness",
		"asri-enhance-midnight",
		"asri-enhance-salt",
		"asri-enhance-rosepine",
		"asri-enhance-oxygen",
		"asri-enhance-shade",
	],
};
export async function onTopazClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
	return onPaletteClick(plugin, TOPAZ_PALETTE_INFO, event);
}
export async function applyTopazConfig(plugin: Plugin): Promise<void> {
	return applyPaletteConfig(plugin, TOPAZ_PALETTE_INFO);
}
export { removeTopazConfig };
