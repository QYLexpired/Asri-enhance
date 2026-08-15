import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const EMBOSSEDPAPER_INFO = createTextureInfo("embossedpaper");
export const onEmbossedpaperClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, EMBOSSEDPAPER_INFO, event);
export const applyEmbossedpaperConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, EMBOSSEDPAPER_INFO, config);
export const removeEmbossedpaperConfig = () => removeTextureConfig(EMBOSSEDPAPER_INFO);
