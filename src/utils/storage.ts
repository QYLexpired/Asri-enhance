import { Plugin } from "siyuan";
const PALETTE_PREFIX = "asri-enhance-";
export const PALETTE_NAMES = [
	"amber",
	"wilderness",
	"midnight",
	"salt",
	"rosepine",
	"topaz",
	"oxygen",
	"shade",
	"gruvbox",
	"glitch",
] as const;
export type PaletteName = typeof PALETTE_NAMES[number];
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
export async function removePaletteConfig(
	plugin: Plugin,
	palette: PaletteName,
	configFile: string = "config.json",
): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) return;
	const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
	if (htmlEl.getAttribute("data-asri-palette") === palette) {
		htmlEl.removeAttribute("data-asri-palette");
	}
	const config = await loadData(plugin, configFile);
	if (!config) return;
	const configKey = `${PALETTE_PREFIX}${palette}`;
	const paletteConfig = config[configKey];
	if (paletteConfig === undefined) return;
	if (typeof paletteConfig === "boolean") {
		delete config[configKey];
	} else if (paletteConfig && typeof paletteConfig === "object") {
		paletteConfig[themeMode] = false;
		config[configKey] = paletteConfig;
	}
	await saveData(plugin, configFile, config);
}
export async function clearAllPluginConfig(
	plugin: Plugin,
	configFile: string = "config.json",
): Promise<void> {
	const config = await loadData(plugin, configFile);
	if (!config) return;
	let hasChanges = false;
	Object.keys(config).forEach((key) => {
		if (key.startsWith(PALETTE_PREFIX)) {
			delete config[key];
			hasChanges = true;
		}
	});
	if (hasChanges) {
		await saveData(plugin, configFile, config);
	}
}
export async function disableAllPalettesForCurrentTheme(
	plugin: Plugin,
	configFile: string = "config.json",
): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) return;
	const themeMode = htmlEl.getAttribute("data-theme-mode") || "light";
	const config = await loadData(plugin, configFile);
	if (!config) return;
	let hasChanges = false;
	PALETTE_NAMES.forEach((palette) => {
		const configKey = `${PALETTE_PREFIX}${palette}`;
		const paletteConfig = config[configKey];
		if (paletteConfig !== undefined) {
			if (typeof paletteConfig === "boolean") {
				delete config[configKey];
				hasChanges = true;
			} else if (paletteConfig && typeof paletteConfig === "object") {
				if (paletteConfig[themeMode] === true) {
					paletteConfig[themeMode] = false;
					config[configKey] = paletteConfig;
					hasChanges = true;
				}
			}
		}
	});
	if (hasChanges) {
		await saveData(plugin, configFile, config);
	}
}
export const removeAmberConfig = (
	plugin: Plugin,
	configFile: string = "config.json",
) => removePaletteConfig(plugin, "amber", configFile);
export const removeWildernessConfig = (
	plugin: Plugin,
	configFile: string = "config.json",
) => removePaletteConfig(plugin, "wilderness", configFile);
export const removeMidnightConfig = (
	plugin: Plugin,
	configFile: string = "config.json",
) => removePaletteConfig(plugin, "midnight", configFile);
export const removeSaltConfig = (
	plugin: Plugin,
	configFile: string = "config.json",
) => removePaletteConfig(plugin, "salt", configFile);
export const removeRosepineConfig = (
	plugin: Plugin,
	configFile: string = "config.json",
) => removePaletteConfig(plugin, "rosepine", configFile);
export const removeTopazConfig = (
	plugin: Plugin,
	configFile: string = "config.json",
) => removePaletteConfig(plugin, "topaz", configFile);
export const removeOxygenConfig = (
	plugin: Plugin,
	configFile: string = "config.json",
) => removePaletteConfig(plugin, "oxygen", configFile);
export const removeShadeConfig = (
	plugin: Plugin,
	configFile: string = "config.json",
) => removePaletteConfig(plugin, "shade", configFile);
export const removeGruvboxConfig = (
	plugin: Plugin,
	configFile: string = "config.json",
) => removePaletteConfig(plugin, "gruvbox", configFile);
export const removeGlitchConfig = (
	plugin: Plugin,
	configFile: string = "config.json",
) => removePaletteConfig(plugin, "glitch", configFile);
