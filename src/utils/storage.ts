import { Plugin } from "siyuan";
export async function saveData(
	plugin: Plugin,
	fileName: string,
	data: Record<string, any>,
): Promise<void> {
	if (!plugin.saveData) {
		throw new Error("Plugin saveData method is not available");
	}
	try {
		await plugin.saveData(fileName, data);
	} catch (err) {
		throw err;
	}
}
export async function loadData(
	plugin: Plugin,
	fileName: string,
): Promise<Record<string, any> | null> {
	if (!plugin.loadData) {
		return null;
	}
	try {
		const data = await plugin.loadData(fileName);
		return data || null;
	} catch (err) {
		return null;
	}
}
export async function removeAmberConfig(
	plugin: Plugin,
	configFile: string = "config.json",
): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) return;
	const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
	if (htmlEl.getAttribute("data-asri-palette") === "amber") {
		htmlEl.removeAttribute("data-asri-palette");
	}
	const config = await loadData(plugin, configFile);
	if (config && config["asri-enhance-amber"]) {
		const amberConfig = config["asri-enhance-amber"];
		if (typeof amberConfig === "boolean") {
			delete config["asri-enhance-amber"];
		} else {
			amberConfig[themeMode] = false;
			config["asri-enhance-amber"] = amberConfig;
		}
		await saveData(plugin, configFile, config);
	}
}
export async function clearAllPluginConfig(
	plugin: Plugin,
	configFile: string = "config.json",
): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) return;
	if (htmlEl.getAttribute("data-asri-palette") === "amber") {
		htmlEl.removeAttribute("data-asri-palette");
	}
	const config = await loadData(plugin, configFile);
	if (config) {
		const keysToRemove = Object.keys(config).filter(key => key.startsWith("asri-enhance-"));
		if (keysToRemove.length > 0) {
			keysToRemove.forEach(key => {
				delete config[key];
			});
			await saveData(plugin, configFile, config);
		}
	}
}
