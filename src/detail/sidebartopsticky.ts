import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-sidebar-top-sticky";
export async function onSidebarTopStickyClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute("data-asri-enhance-sidebar-top-sticky");
    const config = await loadData(plugin, CONFIG_FILE) || {};
    if (isActive) {
        htmlEl.removeAttribute("data-asri-enhance-sidebar-top-sticky");
        config[CONFIG_KEY] = false;
    }
    else {
        htmlEl.setAttribute("data-asri-enhance-sidebar-top-sticky", "true");
        config[CONFIG_KEY] = true;
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
export async function applySidebarTopStickyConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-sidebar-top-sticky", "true");
    }
    else {
        htmlEl.removeAttribute("data-asri-enhance-sidebar-top-sticky");
    }
}
