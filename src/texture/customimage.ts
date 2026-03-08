import { Plugin, Dialog } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-customimage";
const DATA_ATTR = "data-asri-enhance-customimage";
const OTHER_CONFIG_KEYS = ["asri-enhance-paper", "asri-enhance-acrylic", "asri-enhance-checkerboard", "asri-enhance-grid", "asri-enhance-polkadot", "asri-enhance-crossdot", "asri-enhance-honeycomb", "asri-enhance-wood", "asri-enhance-camouflage", "asri-enhance-fiber", "asri-enhance-fabric", "asri-enhance-noise"];
const OTHER_DATA_ATTRS = ["data-asri-enhance-paper", "data-asri-enhance-acrylic", "data-asri-enhance-checkerboard", "data-asri-enhance-grid", "data-asri-enhance-polkadot", "data-asri-enhance-crossdot", "data-asri-enhance-honeycomb", "data-asri-enhance-wood", "data-asri-enhance-camouflage", "data-asri-enhance-fiber", "data-asri-enhance-fabric", "data-asri-enhance-noise"];
export function onCustomImageClick(plugin: Plugin, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    loadData(plugin, CONFIG_FILE).then((config) => {
        const currentValue = config?.[CONFIG_KEY] || false;
        const newValue = !currentValue;
        const newConfig = { ...config, [CONFIG_KEY]: newValue };
        if (newValue) {
            OTHER_CONFIG_KEYS.forEach(key => {
                newConfig[key] = false;
            });
        }
        saveData(plugin, CONFIG_FILE, newConfig).then(() => {
            OTHER_DATA_ATTRS.forEach(attr => {
                document.documentElement.removeAttribute(attr);
            });
            if (newValue) {
                document.documentElement.setAttribute(DATA_ATTR, "true");
                const savedUrl = config?.["asri-enhance-customimage-url"];
                if (savedUrl) {
                    const cssValue = savedUrl.startsWith("url(") ? savedUrl : `url(${savedUrl})`;
                    document.documentElement.style.setProperty("--asri-enhance-customimage-url", cssValue);
                }
                const savedOpacity = config?.["asri-enhance-customimage-opacity-light"] || "0.15";
                document.documentElement.style.setProperty("--asri-enhance-customimage-opacity-light", savedOpacity);
                const savedOpacityDark = config?.["asri-enhance-customimage-opacity-dark"] || "0.15";
                document.documentElement.style.setProperty("--asri-enhance-customimage-opacity-dark", savedOpacityDark);
                const savedBlur = config?.["asri-enhance-customimage-blur"] || "0";
                document.documentElement.style.setProperty("--asri-enhance-customimage-blur", savedBlur + "px");
                const savedEffectLight = config?.["asri-enhance-customimage-effect-light"] || "normal";
                document.documentElement.style.setProperty("--asri-enhance-customimage-effect-light", savedEffectLight);
                const savedEffectDark = config?.["asri-enhance-customimage-effect-dark"] || "normal";
                document.documentElement.style.setProperty("--asri-enhance-customimage-effect-dark", savedEffectDark);
            } else {
                document.documentElement.removeAttribute(DATA_ATTR);
                document.documentElement.style.removeProperty("--asri-enhance-customimage-url");
                document.documentElement.style.removeProperty("--asri-enhance-customimage-opacity-light");
                document.documentElement.style.removeProperty("--asri-enhance-customimage-opacity-dark");
                document.documentElement.style.removeProperty("--asri-enhance-customimage-blur");
                document.documentElement.style.removeProperty("--asri-enhance-customimage-effect-light");
                document.documentElement.style.removeProperty("--asri-enhance-customimage-effect-dark");
            }
        }).catch(() => { });
    }).catch(() => { });
}
export function onCustomImageSettingsClick(plugin: Plugin, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dialog = new Dialog({
        title: plugin.i18n?.customimageSettings || "Custom Image Settings",
        content: `<div class="b3-dialog__content"><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-path">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimagePath || "Image Path"}
        <div class="b3-label__text">${plugin.i18n?.customimagePathTip || "This plugin does not write any data, so only images already in the assets folder are supported. Enter a relative path here, which can be obtained from the image menu"}</div>
    </div>
    <span class="fn__space"></span>
    <input class="b3-text-field fn__flex-center fn__size200" id="asri-enhance-customimage-path" spellcheck="false">
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-blur">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageBlur || "Image Blur"}
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-blur-tooltip" aria-label="0px">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-blur" max="50" min="0" step="1" type="range" value="0">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-opacity-light">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageOpacityLight || "Image Opacity (Light Mode)"}
        <div class="b3-label__text">${plugin.i18n?.customimageOpacityTip || ""}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-opacity-tooltip-light" aria-label="0.15">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-opacity-light" max="1" min="0" step="0.05" type="range" value="0.15">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-effect-light">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageEffectLight || "效果（明亮模式）"}
    </div>
    <span class="fn__space"></span>
    <select class="b3-select fn__flex-center fn__size200" id="asri-enhance-customimage-effect-light">
      <option value="normal">${plugin.i18n?.customimageEffectNormal || "普通"}</option>
      <option value="multiply">${plugin.i18n?.customimageEffectMultiply || "正片叠底"}</option>
      <option value="luminosity">${plugin.i18n?.customimageEffectLuminosity || "明度"}</option>
      <option value="screen">${plugin.i18n?.customimageEffectScreen || "滤色"}</option>
      <option value="color">${plugin.i18n?.customimageEffectColor || "染色"}</option>
      <option value="overlay">${plugin.i18n?.customimageEffectOverlay || "叠加"}</option>
      <option value="color-burn">${plugin.i18n?.customimageEffectColorBurn || "加深"}</option>
      <option value="color-dodge">${plugin.i18n?.customimageEffectColorDodge || "减淡"}</option>
    </select>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-opacity-dark">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageOpacityDark || "Image Opacity (Dark Mode)"}
        <div class="b3-label__text">${plugin.i18n?.customimageOpacityTip || ""}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-opacity-tooltip-dark" aria-label="0.15">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-opacity-dark" max="1" min="0" step="0.05" type="range" value="0.15">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-effect-dark">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageEffectDark || "效果（暗黑模式）"}
    </div>
    <span class="fn__space"></span>
    <select class="b3-select fn__flex-center fn__size200" id="asri-enhance-customimage-effect-dark">
      <option value="normal">${plugin.i18n?.customimageEffectNormal || "普通"}</option>
      <option value="multiply">${plugin.i18n?.customimageEffectMultiply || "正片叠底"}</option>
      <option value="luminosity">${plugin.i18n?.customimageEffectLuminosity || "明度"}</option>
      <option value="screen">${plugin.i18n?.customimageEffectScreen || "滤色"}</option>
      <option value="color">${plugin.i18n?.customimageEffectColor || "染色"}</option>
      <option value="overlay">${plugin.i18n?.customimageEffectOverlay || "叠加"}</option>
      <option value="color-burn">${plugin.i18n?.customimageEffectColorBurn || "加深"}</option>
      <option value="color-dodge">${plugin.i18n?.customimageEffectColorDodge || "减淡"}</option>
    </select>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-x">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimagePositionX || "X Position"}
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-x-tooltip" aria-label="50%">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-x" max="100" min="0" step="1" type="range" value="50">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-y">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimagePositionY || "Y Position"}
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-y-tooltip" aria-label="50%">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-y" max="100" min="0" step="1" type="range" value="50">
    </div>
</div></div><div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel" id="asri-enhance-customimage-cancel">${plugin.i18n?.cancel || "Cancel"}</button><div class="fn__space"></div>
    <button class="b3-button b3-button--text" id="asri-enhance-customimage-confirm">${plugin.i18n?.confirm || "Confirm"}</button>
</div>`,
        width: "max(700px, 50vw)",
    });
    const inputElement = dialog.element.querySelector("#asri-enhance-customimage-path") as HTMLInputElement;
    const opacityElement = dialog.element.querySelector("#asri-enhance-customimage-opacity-light") as HTMLInputElement;
    const opacityTooltipElement = dialog.element.querySelector("#asri-enhance-customimage-opacity-tooltip-light") as HTMLElement;
    const opacityDarkElement = dialog.element.querySelector("#asri-enhance-customimage-opacity-dark") as HTMLInputElement;
    const opacityDarkTooltipElement = dialog.element.querySelector("#asri-enhance-customimage-opacity-tooltip-dark") as HTMLElement;
    const blurElement = dialog.element.querySelector("#asri-enhance-customimage-blur") as HTMLInputElement;
    const blurTooltipElement = dialog.element.querySelector("#asri-enhance-customimage-blur-tooltip") as HTMLElement;
    const effectLightElement = dialog.element.querySelector("#asri-enhance-customimage-effect-light") as HTMLSelectElement;
    const effectDarkElement = dialog.element.querySelector("#asri-enhance-customimage-effect-dark") as HTMLSelectElement;
    const posXElement = dialog.element.querySelector("#asri-enhance-customimage-x") as HTMLInputElement;
    const posXTooltipElement = dialog.element.querySelector("#asri-enhance-customimage-x-tooltip") as HTMLElement;
    const posYElement = dialog.element.querySelector("#asri-enhance-customimage-y") as HTMLInputElement;
    const posYTooltipElement = dialog.element.querySelector("#asri-enhance-customimage-y-tooltip") as HTMLElement;
    loadData(plugin, CONFIG_FILE).then((config) => {
        if (config?.["asri-enhance-customimage-url"]) {
            const urlValue = config["asri-enhance-customimage-url"];
            const urlContent = urlValue.startsWith("url(") ? urlValue.slice(4, -1) : urlValue;
            inputElement.value = urlContent;
        }
        if (config?.["asri-enhance-customimage-opacity-light"]) {
            opacityElement.value = config["asri-enhance-customimage-opacity-light"];
            opacityTooltipElement.setAttribute("aria-label", config["asri-enhance-customimage-opacity-light"]);
        }
        if (config?.["asri-enhance-customimage-opacity-dark"]) {
            opacityDarkElement.value = config["asri-enhance-customimage-opacity-dark"];
            opacityDarkTooltipElement.setAttribute("aria-label", config["asri-enhance-customimage-opacity-dark"]);
        }
        if (config?.["asri-enhance-customimage-blur"]) {
            blurElement.value = config["asri-enhance-customimage-blur"];
            blurTooltipElement.setAttribute("aria-label", config["asri-enhance-customimage-blur"] + "px");
        }
        if (config?.["asri-enhance-customimage-effect-light"]) {
            effectLightElement.value = config["asri-enhance-customimage-effect-light"];
        }
        if (config?.["asri-enhance-customimage-effect-dark"]) {
            effectDarkElement.value = config["asri-enhance-customimage-effect-dark"];
        }
        if (config?.["asri-enhance-customimage-x"]) {
            posXElement.value = config["asri-enhance-customimage-x"];
            posXTooltipElement.setAttribute("aria-label", config["asri-enhance-customimage-x"] + "%");
        }
        if (config?.["asri-enhance-customimage-y"]) {
            posYElement.value = config["asri-enhance-customimage-y"];
            posYTooltipElement.setAttribute("aria-label", config["asri-enhance-customimage-y"] + "%");
        }
    }).catch(() => {});
    inputElement?.addEventListener("input", () => {
        const imagePath = inputElement.value.trim();
        if (imagePath) {
            document.documentElement.style.setProperty("--asri-enhance-customimage-url", `url(${imagePath})`);
        } else {
            document.documentElement.style.removeProperty("--asri-enhance-customimage-url");
        }
    });
    opacityElement?.addEventListener("input", () => {
        const opacityValue = opacityElement.value;
        opacityTooltipElement.setAttribute("aria-label", opacityValue);
        document.documentElement.style.setProperty("--asri-enhance-customimage-opacity-light", opacityValue);
    });
    opacityDarkElement?.addEventListener("input", () => {
        const opacityValue = opacityDarkElement.value;
        opacityDarkTooltipElement.setAttribute("aria-label", opacityValue);
        document.documentElement.style.setProperty("--asri-enhance-customimage-opacity-dark", opacityValue);
    });
    blurElement?.addEventListener("input", () => {
        const blurValue = blurElement.value;
        blurTooltipElement.setAttribute("aria-label", blurValue + "px");
        document.documentElement.style.setProperty("--asri-enhance-customimage-blur", blurValue + "px");
    });
    effectLightElement?.addEventListener("change", () => {
        const effectValue = effectLightElement.value;
        document.documentElement.style.setProperty("--asri-enhance-customimage-effect-light", effectValue);
    });
    effectDarkElement?.addEventListener("change", () => {
        document.documentElement.style.setProperty("--asri-enhance-customimage-effect-dark", effectDarkElement.value);
    });
    posXElement?.addEventListener("input", () => {
        const posXValue = posXElement.value;
        posXTooltipElement.setAttribute("aria-label", posXValue + "%");
        document.documentElement.style.setProperty("--asri-enhance-customimage-x", posXValue + "%");
    });
    posYElement?.addEventListener("input", () => {
        const posYValue = posYElement.value;
        posYTooltipElement.setAttribute("aria-label", posYValue + "%");
        document.documentElement.style.setProperty("--asri-enhance-customimage-y", posYValue + "%");
    });
    dialog.element.querySelector("#asri-enhance-customimage-cancel")?.addEventListener("click", () => {
        document.documentElement.style.removeProperty("--asri-enhance-customimage-url");
        document.documentElement.style.removeProperty("--asri-enhance-customimage-opacity-light");
        document.documentElement.style.removeProperty("--asri-enhance-customimage-opacity-dark");
        document.documentElement.style.removeProperty("--asri-enhance-customimage-blur");
        document.documentElement.style.removeProperty("--asri-enhance-customimage-effect-light");
        document.documentElement.style.removeProperty("--asri-enhance-customimage-effect-dark");
        document.documentElement.style.removeProperty("--asri-enhance-customimage-x");
        document.documentElement.style.removeProperty("--asri-enhance-customimage-y");
        loadData(plugin, CONFIG_FILE).then((config) => {
            applyCustomImageConfig(plugin, config);
        }).catch(() => {
            removeCustomImageConfig();
        });
        dialog.destroy();
    });
    dialog.element.querySelector("#asri-enhance-customimage-confirm")?.addEventListener("click", async () => {
        const imagePath = inputElement.value.trim();
        const opacityValue = opacityElement.value;
        const opacityDarkValue = opacityDarkElement.value;
        const blurValue = blurElement.value;
        const effectLightValue = effectLightElement.value;
        const effectDarkValue = effectDarkElement.value;
        const posXValue = posXElement.value;
        const posYValue = posYElement.value;
        const newConfig: Record<string, any> = { 
            "asri-enhance-customimage-url": imagePath ? `url(${imagePath})` : "",
            "asri-enhance-customimage-opacity-light": opacityValue,
            "asri-enhance-customimage-opacity-dark": opacityDarkValue,
            "asri-enhance-customimage-blur": blurValue,
            "asri-enhance-customimage-effect-light": effectLightValue,
            "asri-enhance-customimage-effect-dark": effectDarkValue,
            "asri-enhance-customimage-x": posXValue,
            "asri-enhance-customimage-y": posYValue
        };
        const config = await loadData(plugin, CONFIG_FILE);
        const finalConfig = { ...config, ...newConfig };
        await saveData(plugin, CONFIG_FILE, finalConfig);
        applyCustomImageConfig(plugin, finalConfig);
        dialog.destroy();
    });
}
export async function applyCustomImageConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    const enabled = configData?.[CONFIG_KEY];
    const imageUrl = configData?.["asri-enhance-customimage-url"];
    const opacityLight = configData?.["asri-enhance-customimage-opacity-light"];
    const opacityDark = configData?.["asri-enhance-customimage-opacity-dark"];
    const blurValue = configData?.["asri-enhance-customimage-blur"];
    const effectLight = configData?.["asri-enhance-customimage-effect-light"];
    const effectDark = configData?.["asri-enhance-customimage-effect-dark"];
    const posX = configData?.["asri-enhance-customimage-x"];
    const posY = configData?.["asri-enhance-customimage-y"];
    const otherEnabled = OTHER_CONFIG_KEYS.some(key => 
        configData?.[key] === true || configData?.[key] === "true"
    );
    if (enabled === true || enabled === "true") {
        if (!otherEnabled) {
            htmlEl.setAttribute(DATA_ATTR, "true");
            if (imageUrl) {
                const cssValue = imageUrl.startsWith("url(") ? imageUrl : `url(${imageUrl})`;
                htmlEl.style.setProperty("--asri-enhance-customimage-url", cssValue);
            }
            const opacityValue = opacityLight || "0.15";
            htmlEl.style.setProperty("--asri-enhance-customimage-opacity-light", opacityValue);
            const opacityDarkValue = opacityDark || "0.15";
            htmlEl.style.setProperty("--asri-enhance-customimage-opacity-dark", opacityDarkValue);
            const blur = blurValue || "0";
            htmlEl.style.setProperty("--asri-enhance-customimage-blur", blur + "px");
            const effectLightValue = effectLight || "normal";
            htmlEl.style.setProperty("--asri-enhance-customimage-effect-light", effectLightValue);
            const effectDarkValue = effectDark || "normal";
            htmlEl.style.setProperty("--asri-enhance-customimage-effect-dark", effectDarkValue);
            const posXValue = posX || "50";
            htmlEl.style.setProperty("--asri-enhance-customimage-x", posXValue + "%");
            const posYValue = posY || "50";
            htmlEl.style.setProperty("--asri-enhance-customimage-y", posYValue + "%");
        } else {
            htmlEl.removeAttribute(DATA_ATTR);
            htmlEl.style.removeProperty("--asri-enhance-customimage-url");
            htmlEl.style.removeProperty("--asri-enhance-customimage-opacity-light");
            htmlEl.style.removeProperty("--asri-enhance-customimage-opacity-dark");
            htmlEl.style.removeProperty("--asri-enhance-customimage-blur");
            htmlEl.style.removeProperty("--asri-enhance-customimage-effect-light");
            htmlEl.style.removeProperty("--asri-enhance-customimage-effect-dark");
            htmlEl.style.removeProperty("--asri-enhance-customimage-x");
            htmlEl.style.removeProperty("--asri-enhance-customimage-y");
        }
    } else {
        htmlEl.removeAttribute(DATA_ATTR);
        htmlEl.style.removeProperty("--asri-enhance-customimage-url");
        htmlEl.style.removeProperty("--asri-enhance-customimage-opacity-light");
        htmlEl.style.removeProperty("--asri-enhance-customimage-opacity-dark");
        htmlEl.style.removeProperty("--asri-enhance-customimage-blur");
        htmlEl.style.removeProperty("--asri-enhance-customimage-effect-light");
        htmlEl.style.removeProperty("--asri-enhance-customimage-effect-dark");
        htmlEl.style.removeProperty("--asri-enhance-customimage-x");
        htmlEl.style.removeProperty("--asri-enhance-customimage-y");
    }
}
export function removeCustomImageConfig(): void {
    document.documentElement.removeAttribute(DATA_ATTR);
    document.documentElement.style.removeProperty("--asri-enhance-customimage-url");
    document.documentElement.style.removeProperty("--asri-enhance-customimage-opacity-light");
    document.documentElement.style.removeProperty("--asri-enhance-customimage-opacity-dark");
    document.documentElement.style.removeProperty("--asri-enhance-customimage-blur");
    document.documentElement.style.removeProperty("--asri-enhance-customimage-effect-light");
    document.documentElement.style.removeProperty("--asri-enhance-customimage-effect-dark");
    document.documentElement.style.removeProperty("--asri-enhance-customimage-x");
    document.documentElement.style.removeProperty("--asri-enhance-customimage-y");
}
