import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const NOISE_INFO = createTextureInfo("noise");
export const onNoiseClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, NOISE_INFO, event);
export const applyNoiseConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, NOISE_INFO, config);
export const removeNoiseConfig = () => removeTextureConfig(NOISE_INFO);