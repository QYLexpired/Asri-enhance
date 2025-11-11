import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";

const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-coloredoutline";

export async function onColoredOutlineClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}
	
	const htmlEl = document.documentElement;
	if (!htmlEl) {
		return;
	}
	
	// 检查当前是否已有该属性
	const isActive = htmlEl.hasAttribute("data-asri-enhance-coloredoutline");
	
	// 加载配置
	const config = await loadData(plugin, CONFIG_FILE) || {};
	
	// 更新 DOM 和配置
	if (isActive) {
		htmlEl.removeAttribute("data-asri-enhance-coloredoutline");
		config[CONFIG_KEY] = false;
	} else {
		htmlEl.setAttribute("data-asri-enhance-coloredoutline", "true");
		config[CONFIG_KEY] = true;
	}
	
	// 保存配置
	await saveData(plugin, CONFIG_FILE, config).catch(() => {
	});
}

export async function applyColoredOutlineConfig(plugin: Plugin): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) {
		return;
	}
	
	const config = await loadData(plugin, CONFIG_FILE);
	
	if (config && config[CONFIG_KEY] === true) {
		htmlEl.setAttribute("data-asri-enhance-coloredoutline", "true");
	} else {
		htmlEl.removeAttribute("data-asri-enhance-coloredoutline");
	}
}

