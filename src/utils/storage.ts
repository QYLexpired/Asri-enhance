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
export async function removeWildernessConfig(
	plugin: Plugin,
	configFile: string = "config.json",
): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) return;
	const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
	if (htmlEl.getAttribute("data-asri-palette") === "wilderness") {
		htmlEl.removeAttribute("data-asri-palette");
	}
	const config = await loadData(plugin, configFile);
	if (config && config["asri-enhance-wilderness"]) {
		const wildernessConfig = config["asri-enhance-wilderness"];
		if (typeof wildernessConfig === "boolean") {
			delete config["asri-enhance-wilderness"];
		} else {
			wildernessConfig[themeMode] = false;
			config["asri-enhance-wilderness"] = wildernessConfig;
		}
		await saveData(plugin, configFile, config);
	}
}
export async function removeMidnightConfig(
	plugin: Plugin,
	configFile: string = "config.json",
): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) return;
	const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
	if (htmlEl.getAttribute("data-asri-palette") === "midnight") {
		htmlEl.removeAttribute("data-asri-palette");
	}
	const config = await loadData(plugin, configFile);
	if (config && config["asri-enhance-midnight"]) {
		const midnightConfig = config["asri-enhance-midnight"];
		if (typeof midnightConfig === "boolean") {
			delete config["asri-enhance-midnight"];
		} else {
			midnightConfig[themeMode] = false;
			config["asri-enhance-midnight"] = midnightConfig;
		}
		await saveData(plugin, configFile, config);
	}
}
export async function removeSaltConfig(
	plugin: Plugin,
	configFile: string = "config.json",
): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) return;
	const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
	if (htmlEl.getAttribute("data-asri-palette") === "salt") {
		htmlEl.removeAttribute("data-asri-palette");
	}
	const config = await loadData(plugin, configFile);
	if (config && config["asri-enhance-salt"]) {
		const saltConfig = config["asri-enhance-salt"];
		if (typeof saltConfig === "boolean") {
			delete config["asri-enhance-salt"];
		} else {
			saltConfig[themeMode] = false;
			config["asri-enhance-salt"] = saltConfig;
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
	if (htmlEl.getAttribute("data-asri-palette") === "amber" || htmlEl.getAttribute("data-asri-palette") === "wilderness" || htmlEl.getAttribute("data-asri-palette") === "midnight" || htmlEl.getAttribute("data-asri-palette") === "salt") {
		htmlEl.removeAttribute("data-asri-palette");
	}
	if (htmlEl.hasAttribute("data-asri-enhance-coloredheading")) {
		htmlEl.removeAttribute("data-asri-enhance-coloredheading");
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
