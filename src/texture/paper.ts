import { Plugin } from "siyuan";
import { createTextureInfo, onTextureClick, applyTextureConfig, removeTextureConfig } from "./manager";
const PAPER_INFO = createTextureInfo("paper");
export const onPaperClick = (plugin: Plugin, event: MouseEvent) =>
    onTextureClick(plugin, PAPER_INFO, event);
export const applyPaperConfig = (plugin: Plugin, config?: Record<string, any> | null) =>
    applyTextureConfig(plugin, PAPER_INFO, config);
export const removePaperConfig = () => removeTextureConfig(PAPER_INFO);