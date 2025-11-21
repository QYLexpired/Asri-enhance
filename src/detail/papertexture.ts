import { Plugin } from "siyuan";
import { loadData, saveData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-paper-texture";
const DATA_ATTRIBUTE = "data-asri-enhance-paper-texture";
export async function onPaperTextureClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}
	const htmlEl = document.documentElement;
	if (!htmlEl) {
		return;
	}
	const isActive = htmlEl.hasAttribute(DATA_ATTRIBUTE);
	const config = (await loadData(plugin, CONFIG_FILE)) || {};
	if (isActive) {
		htmlEl.removeAttribute(DATA_ATTRIBUTE);
		config[CONFIG_KEY] = false;
	} else {
		htmlEl.setAttribute(DATA_ATTRIBUTE, "true");
		config[CONFIG_KEY] = true;
	}
	await saveData(plugin, CONFIG_FILE, config).catch(() => {
	});
}
export async function applyPaperTextureConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) {
		return;
	}
	const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
	if (configData && configData[CONFIG_KEY] === true) {
		htmlEl.setAttribute(DATA_ATTRIBUTE, "true");
	} else {
		htmlEl.removeAttribute(DATA_ATTRIBUTE);
	}
}
