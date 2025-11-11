import { Plugin } from "siyuan";
import { removeAmberConfig } from "../utils/storage";
import { onPaletteClick, applyPaletteConfig, type PaletteInfo } from "./manager";

const AMBER_PALETTE_INFO: PaletteInfo = {
	name: "amber",
	configKey: "asri-enhance-amber",
	otherConfigKeys: ["asri-enhance-wilderness"]
};

export async function onAmberClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
	return onPaletteClick(plugin, AMBER_PALETTE_INFO, event);
}

export async function applyAmberConfig(plugin: Plugin): Promise<void> {
	return applyPaletteConfig(plugin, AMBER_PALETTE_INFO);
}

export { removeAmberConfig };
