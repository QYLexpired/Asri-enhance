import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const GRANULE_INFO = createTextureInfo("granule");
export const onGranuleClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, GRANULE_INFO, event);
export const applyGranuleConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, GRANULE_INFO, config);
export const removeGranuleConfig = () => removeTextureConfig(GRANULE_INFO);
