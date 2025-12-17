import { Plugin } from "siyuan";
import { removeOxygenConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";
const OXYGEN_PALETTE_INFO: PaletteInfo = {
	name: "oxygen",
	configKey: "asri-enhance-oxygen",
	otherConfigKeys: [
		"asri-enhance-sakura",
		"asri-enhance-amber",
		"asri-enhance-wilderness",
		"asri-enhance-midnight",
		"asri-enhance-salt",
		"asri-enhance-rosepine",
		"asri-enhance-topaz",
		"asri-enhance-shade",
		"asri-enhance-gruvbox",
		"asri-enhance-glitch",
	],
};
export async function onOxygenClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
	return onPaletteClick(plugin, OXYGEN_PALETTE_INFO, event);
}
export async function applyOxygenConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
	return applyPaletteConfig(plugin, OXYGEN_PALETTE_INFO, config);
}
export { removeOxygenConfig };
