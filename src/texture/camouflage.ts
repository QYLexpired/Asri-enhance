import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const CAMOUFLAGE_INFO = createTextureInfo("camouflage");
export const onCamouflageClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, CAMOUFLAGE_INFO, event);
export const applyCamouflageConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, CAMOUFLAGE_INFO, config);
export const removeCamouflageConfig = () => removeTextureConfig(CAMOUFLAGE_INFO);