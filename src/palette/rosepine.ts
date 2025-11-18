import { Plugin } from "siyuan";
import { removeRosepineConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const ROSE_PINE_PALETTE_INFO: PaletteInfo = {
	name: "rosepine",
	configKey: "asri-enhance-rosepine",
	otherConfigKeys: [
		"asri-enhance-amber",
		"asri-enhance-wilderness",
		"asri-enhance-midnight",
		"asri-enhance-salt",
		"asri-enhance-topaz",
		"asri-enhance-oxygen",
		"asri-enhance-shade",
		"asri-enhance-gruvbox",
	],
};
export async function onRosepineClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
	return onPaletteClick(plugin, ROSE_PINE_PALETTE_INFO, event);
}
export async function applyRosepineConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
	return applyPaletteConfig(plugin, ROSE_PINE_PALETTE_INFO, config);
}
export { removeRosepineConfig };
