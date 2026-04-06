import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
export const TEXTURE_NAMES = [
    "paper",
    "noise",
    "acrylic",
    "checkerboard",
    "grid",
    "crossdot",
    "wood",
    "camouflage",
    "customimage",
] as const;
export type TextureName = typeof TEXTURE_NAMES[number];
export interface TextureInfo {
    name: TextureName;
    configKey: string;
    dataAttr: string;
    otherConfigKeys: string[];
    otherDataAttrs: string[];
}
const CONFIG_FILE = "config.json";
export { CONFIG_FILE };
export function createTextureInfo(name: TextureName): TextureInfo {
    return {
        name,
        configKey: `asri-enhance-${name}`,
        dataAttr: `data-asri-enhance-${name}`,
        otherConfigKeys: TEXTURE_NAMES
            .filter(n => n !== name)
            .map(n => `asri-enhance-${n}`),
        otherDataAttrs: TEXTURE_NAMES
            .filter(n => n !== name)
            .map(n => `data-asri-enhance-${n}`),
    };
}
export function onTextureClick(
    plugin: Plugin,
    textureInfo: TextureInfo,
    event: MouseEvent
): void {
    event.preventDefault();
    event.stopPropagation();
    loadData(plugin, CONFIG_FILE).then((config) => {
        const currentValue = config?.[textureInfo.configKey] || false;
        const newValue = !currentValue;
        const newConfig = { ...config, [textureInfo.configKey]: newValue };
        if (newValue) {
            textureInfo.otherConfigKeys.forEach(key => {
                newConfig[key] = false;
            });
        }
        saveData(plugin, CONFIG_FILE, newConfig).then(() => {
            textureInfo.otherDataAttrs.forEach(attr => {
                document.documentElement.removeAttribute(attr);
            });
            if (newValue) {
                document.documentElement.setAttribute(textureInfo.dataAttr, "true");
            } else {
                document.documentElement.removeAttribute(textureInfo.dataAttr);
            }
        }).catch(() => { });
    }).catch(() => { });
}
export async function applyTextureConfig(
    plugin: Plugin,
    textureInfo: TextureInfo,
    config?: Record<string, any> | null
): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    const enabled = configData?.[textureInfo.configKey];
    const otherEnabled = textureInfo.otherConfigKeys.some(key =>
        configData?.[key] === true || configData?.[key] === "true"
    );
    if (enabled === true || enabled === "true") {
        if (!otherEnabled) {
            htmlEl.setAttribute(textureInfo.dataAttr, "true");
        } else {
            htmlEl.removeAttribute(textureInfo.dataAttr);
        }
    } else {
        htmlEl.removeAttribute(textureInfo.dataAttr);
    }
}
export function removeTextureConfig(textureInfo: TextureInfo): void {
    document.documentElement.removeAttribute(textureInfo.dataAttr);
}