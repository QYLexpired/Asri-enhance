import { Plugin } from "siyuan";
import { saveData, loadData, removeAmberConfig } from "../utils/storage";
const CONFIG_FILE = "config.json";
export async function onAmberClick(plugin: Plugin, _event?: MouseEvent): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) return;
	const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
	const isAmberActive = htmlEl.getAttribute("data-asri-palette") === "amber";
	const config = await loadData(plugin, CONFIG_FILE) || {};
	const amberConfig = config["asri-enhance-amber"] || { light: false, dark: false };
	if (isAmberActive) {
		htmlEl.removeAttribute("data-asri-palette");
		amberConfig[themeMode] = false;
		config["asri-enhance-amber"] = amberConfig;
		await saveData(plugin, CONFIG_FILE, config).catch(() => {
		});
	} else {
		htmlEl.removeAttribute("data-asri-palette");
		htmlEl.setAttribute("data-asri-palette", "amber");
		amberConfig[themeMode] = true;
		config["asri-enhance-amber"] = amberConfig;
		await saveData(plugin, CONFIG_FILE, config).catch(() => {
		});
	}
}
export async function applyAmberConfig(plugin: Plugin): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) return;
	const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
	const config = await loadData(plugin, CONFIG_FILE);
	if (config && config["asri-enhance-amber"]) {
		const amberConfig = config["asri-enhance-amber"];
		const shouldApply = typeof amberConfig === "boolean" 
			? amberConfig 
			: (amberConfig[themeMode] === true);
		if (shouldApply) {
			htmlEl.removeAttribute("data-asri-palette");
			htmlEl.setAttribute("data-asri-palette", "amber");
		} else {
			if (htmlEl.getAttribute("data-asri-palette") === "amber") {
				htmlEl.removeAttribute("data-asri-palette");
			}
		}
	}
}
