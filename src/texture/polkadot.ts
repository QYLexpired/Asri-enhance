import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-polkadot";
const DATA_ATTR = "data-asri-enhance-polkadot";
const OTHER_CONFIG_KEYS = ["asri-enhance-paper", "asri-enhance-noise", "asri-enhance-acrylic", "asri-enhance-checkerboard", "asri-enhance-grid", "asri-enhance-crossdot", "asri-enhance-honeycomb", "asri-enhance-wood", "asri-enhance-camouflage", "asri-enhance-fiber", "asri-enhance-fabric"];
const OTHER_DATA_ATTRS = ["data-asri-enhance-paper", "data-asri-enhance-noise", "data-asri-enhance-acrylic", "data-asri-enhance-checkerboard", "data-asri-enhance-grid", "data-asri-enhance-crossdot", "data-asri-enhance-honeycomb", "data-asri-enhance-wood", "data-asri-enhance-camouflage", "data-asri-enhance-fiber", "data-asri-enhance-fabric"];
export function onPolkaDotClick(plugin: Plugin, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    loadData(plugin, CONFIG_FILE).then((config) => {
        const currentValue = config?.[CONFIG_KEY] || false;
        const newValue = !currentValue;
        const newConfig = { ...config, [CONFIG_KEY]: newValue };
        if (newValue) {
            OTHER_CONFIG_KEYS.forEach(key => {
                newConfig[key] = false;
            });
        }
        saveData(plugin, CONFIG_FILE, newConfig).then(() => {
            OTHER_DATA_ATTRS.forEach(attr => {
                document.documentElement.removeAttribute(attr);
            });
            if (newValue) {
                document.documentElement.setAttribute(DATA_ATTR, "true");
            } else {
                document.documentElement.removeAttribute(DATA_ATTR);
            }
        }).catch(() => { });
    }).catch(() => { });
}
export async function applyPolkaDotConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    const enabled = configData?.[CONFIG_KEY];
    const otherEnabled = OTHER_CONFIG_KEYS.some(key => 
        configData?.[key] === true || configData?.[key] === "true"
    );
    if (enabled === true || enabled === "true") {
        if (!otherEnabled) {
            htmlEl.setAttribute(DATA_ATTR, "true");
        } else {
            htmlEl.removeAttribute(DATA_ATTR);
        }
    } else {
        htmlEl.removeAttribute(DATA_ATTR);
    }
}
export function removePolkaDotConfig(): void {
    document.documentElement.removeAttribute(DATA_ATTR);
}
