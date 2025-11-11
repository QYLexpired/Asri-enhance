import { Plugin } from "siyuan";
import { removeMidnightConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";

const MIDNIGHT_PALETTE_INFO: PaletteInfo = {
	name: "midnight",
	configKey: "asri-enhance-midnight",
	otherConfigKeys: ["asri-enhance-amber", "asri-enhance-wilderness"]
};

export async function onMidnightClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
	return onPaletteClick(plugin, MIDNIGHT_PALETTE_INFO, event);
}

export async function applyMidnightConfig(plugin: Plugin): Promise<void> {
	return applyPaletteConfig(plugin, MIDNIGHT_PALETTE_INFO);
}

export { removeMidnightConfig };

