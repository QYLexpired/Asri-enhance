import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const NEWSPRINT_INFO = createTextureInfo("newsprint");
export const onNewsprintClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, NEWSPRINT_INFO, event);
export const applyNewsprintConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, NEWSPRINT_INFO, config);
export const removeNewsprintConfig = () => removeTextureConfig(NEWSPRINT_INFO);