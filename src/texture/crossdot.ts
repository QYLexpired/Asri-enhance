import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const CROSSDOT_INFO = createTextureInfo("crossdot");
export const onCrossDotClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, CROSSDOT_INFO, event);
export const applyCrossDotConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, CROSSDOT_INFO, config);
export const removeCrossDotConfig = () => removeTextureConfig(CROSSDOT_INFO);