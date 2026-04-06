import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const CHECKERBOARD_INFO = createTextureInfo("checkerboard");
export const onCheckerboardClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, CHECKERBOARD_INFO, event);
export const applyCheckerboardConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, CHECKERBOARD_INFO, config);
export const removeCheckerboardConfig = () => removeTextureConfig(CHECKERBOARD_INFO);