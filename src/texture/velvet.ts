import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const VELVET_INFO = createTextureInfo("velvet");
export const onVelvetClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, VELVET_INFO, event);
export const applyVelvetConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, VELVET_INFO, config);
export const removeVelvetConfig = () => removeTextureConfig(VELVET_INFO);
