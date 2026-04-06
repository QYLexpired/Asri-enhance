import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const WOOD_INFO = createTextureInfo("wood");
export const onWoodClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, WOOD_INFO, event);
export const applyWoodConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, WOOD_INFO, config);
export const removeWoodConfig = () => removeTextureConfig(WOOD_INFO);