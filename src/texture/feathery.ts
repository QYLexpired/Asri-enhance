import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const FEATHERY_INFO = createTextureInfo("feathery");
export const onFeatheryClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, FEATHERY_INFO, event);
export const applyFeatheryConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, FEATHERY_INFO, config);
export const removeFeatheryConfig = () => removeTextureConfig(FEATHERY_INFO);
