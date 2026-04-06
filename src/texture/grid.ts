import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const GRID_INFO = createTextureInfo("grid");
export const onGridClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, GRID_INFO, event);
export const applyGridConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, GRID_INFO, config);
export const removeGridConfig = () => removeTextureConfig(GRID_INFO);