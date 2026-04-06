import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const ACRYLIC_INFO = createTextureInfo("acrylic");
export const onAcrylicClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, ACRYLIC_INFO, event);
export const applyAcrylicConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, ACRYLIC_INFO, config);
export const removeAcrylicConfig = () => removeTextureConfig(ACRYLIC_INFO);