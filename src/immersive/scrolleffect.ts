import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-scrolleffect";
const STYLE_ID = "asri-enhance-scrolleffect-style";
const SCROLL_EFFECT_CSS = `
#preview [data-node-id],
#preview .protyle-title,
#preview .protyle-action,
.export-img [data-node-id],
.export-img .protyle-title,
.export-img .protyle-action,
.callout [data-node-id] {
    animation: none !important;
}
.protyle-wysiwyg .bq {
    overflow: unset;
}
.protyle-wysiwyg [data-node-id]:not(.callout),
.protyle-action {
    animation:
        asri-scroll-reveal-entry cubic-bezier(0.46, 0.03, 0.52, 0.96) both,
        asri-scroll-reveal-exit  cubic-bezier(0.46, 0.03, 0.52, 0.96) forwards;
    animation-timeline: view(block), view(block);
    animation-range: entry 0% entry 180px, exit calc(100% - 180px) exit 100%;
}
@keyframes asri-scroll-reveal-entry {
    from {
        opacity: 0.2;
        transform: translate(12px, 25px);
        filter: blur(2px);
    }
    to {
        opacity: 1;
        transform: translate(0, 0);
        filter: blur(0);
    }
}
@keyframes asri-scroll-reveal-exit {
    from {
        opacity: 1;
        transform: translate(0, 0);
        filter: blur(0);
    }
    to {
        opacity: 0.5;
        transform: translate(-12px, -25px);
        filter: blur(2px);
    }
}
`;
function injectStyle(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = SCROLL_EFFECT_CSS;
    document.head.appendChild(style);
}
function removeStyle(): void {
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
}
export async function onScrollEffectClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) return;
    const isActive = htmlEl.classList.contains("asri-enhance-scrolleffect");
    const config = await loadData(plugin, CONFIG_FILE) || {};
    if (isActive) {
        htmlEl.classList.remove("asri-enhance-scrolleffect");
        removeStyle();
        config[CONFIG_KEY] = false;
    } else {
        htmlEl.classList.add("asri-enhance-scrolleffect");
        injectStyle();
        config[CONFIG_KEY] = true;
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {});
}
export async function applyScrollEffectConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) return;
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.classList.add("asri-enhance-scrolleffect");
        injectStyle();
    } else {
        htmlEl.classList.remove("asri-enhance-scrolleffect");
        removeStyle();
    }
}
export function destroyScrollEffect(): void {
    document.documentElement?.classList.remove("asri-enhance-scrolleffect");
    removeStyle();
}
