import { Plugin, Dialog } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-customimage";
const DATA_ATTR = "data-asri-enhance-customimage";
const OTHER_CONFIG_KEYS = ["asri-enhance-paper", "asri-enhance-acrylic", "asri-enhance-checkerboard", "asri-enhance-grid", "asri-enhance-polkadot", "asri-enhance-crossdot", "asri-enhance-wood", "asri-enhance-camouflage", "asri-enhance-noise"];
const OTHER_DATA_ATTRS = ["data-asri-enhance-paper", "data-asri-enhance-acrylic", "data-asri-enhance-checkerboard", "data-asri-enhance-grid", "data-asri-enhance-polkadot", "data-asri-enhance-crossdot", "data-asri-enhance-wood", "data-asri-enhance-camouflage", "data-asri-enhance-noise"];
const DEFAULT_PRESET_KEY = "asri-enhance-customimage-default";
const CURRENT_PRESET_KEY = "asri-enhance-customimage-current";
type CustomImageField = {
    configKey: string;
    cssVar: string;
    toCss: (raw: string | undefined) => string;
    inputSelector?: string;
    tooltipSelector?: string;
    event?: "input" | "change";
    tooltipSuffix?: string;
    valueFromConfig?: (v: string) => string;
    valueToConfig?: (v: string) => string;
};
const CUSTOM_IMAGE_FIELDS: CustomImageField[] = [
    {
        configKey: "asri-enhance-customimage-url",
        cssVar: "--asri-enhance-customimage-url",
        toCss: (raw: string | undefined) =>
            !raw ? "unset" : raw.startsWith("url(") ? raw : `url(${raw})`,
        inputSelector: "#asri-enhance-customimage-path",
        tooltipSelector: undefined,
        event: "input",
        tooltipSuffix: "",
        valueFromConfig: (v: string) =>
            v.startsWith("url(") ? v.slice(4, -1) : v,
        valueToConfig: (v: string) =>
            v.trim() ? `url(${v.trim()})` : "",
    },
    {
        configKey: "asri-enhance-customimage-opacity-light",
        cssVar: "--asri-enhance-customimage-opacity-light",
        toCss: (raw: string | undefined) => raw ?? "0.15",
        inputSelector: "#asri-enhance-customimage-opacity-light",
        tooltipSelector: "#asri-enhance-customimage-opacity-tooltip-light",
        event: "input",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-opacity-dark",
        cssVar: "--asri-enhance-customimage-opacity-dark",
        toCss: (raw: string | undefined) => raw ?? "0.1",
        inputSelector: "#asri-enhance-customimage-opacity-dark",
        tooltipSelector: "#asri-enhance-customimage-opacity-tooltip-dark",
        event: "input",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-blur",
        cssVar: "--asri-enhance-customimage-blur",
        toCss: (raw: string | undefined) => (raw ?? "0") + "px",
        inputSelector: "#asri-enhance-customimage-blur",
        tooltipSelector: "#asri-enhance-customimage-blur-tooltip",
        event: "input",
        tooltipSuffix: "px",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-frosted",
        cssVar: "--asri-enhance-customimage-frosted",
        toCss: (raw: string | undefined) => raw === "true" ? "block" : "none",
        inputSelector: "#asri-enhance-customimage-frosted",
        tooltipSelector: undefined,
        event: "change",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-effect-light",
        cssVar: "--asri-enhance-customimage-effect-light",
        toCss: (raw: string | undefined) => raw ?? "normal",
        inputSelector: "#asri-enhance-customimage-effect-light",
        tooltipSelector: undefined,
        event: "change",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-effect-dark",
        cssVar: "--asri-enhance-customimage-effect-dark",
        toCss: (raw: string | undefined) => raw ?? "normal",
        inputSelector: "#asri-enhance-customimage-effect-dark",
        tooltipSelector: undefined,
        event: "change",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-x",
        cssVar: "--asri-enhance-customimage-x",
        toCss: (raw: string | undefined) => (raw ?? "50") + "%",
        inputSelector: "#asri-enhance-customimage-x",
        tooltipSelector: "#asri-enhance-customimage-x-tooltip",
        event: "input",
        tooltipSuffix: "%",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-y",
        cssVar: "--asri-enhance-customimage-y",
        toCss: (raw: string | undefined) => (raw ?? "50") + "%",
        inputSelector: "#asri-enhance-customimage-y",
        tooltipSelector: "#asri-enhance-customimage-y-tooltip",
        event: "input",
        tooltipSuffix: "%",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-brightness-light",
        cssVar: "--asri-enhance-customimage-brightness-light",
        toCss: (raw: string | undefined) => raw ?? "1",
        inputSelector: "#asri-enhance-customimage-brightness-light",
        tooltipSelector: "#asri-enhance-customimage-brightness-tooltip-light",
        event: "input",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-brightness-dark",
        cssVar: "--asri-enhance-customimage-brightness-dark",
        toCss: (raw: string | undefined) => raw ?? "1",
        inputSelector: "#asri-enhance-customimage-brightness-dark",
        tooltipSelector: "#asri-enhance-customimage-brightness-tooltip-dark",
        event: "input",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-saturation-light",
        cssVar: "--asri-enhance-customimage-saturation-light",
        toCss: (raw: string | undefined) => raw ?? "1",
        inputSelector: "#asri-enhance-customimage-saturation-light",
        tooltipSelector: "#asri-enhance-customimage-saturation-tooltip-light",
        event: "input",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-saturation-dark",
        cssVar: "--asri-enhance-customimage-saturation-dark",
        toCss: (raw: string | undefined) => raw ?? "1",
        inputSelector: "#asri-enhance-customimage-saturation-dark",
        tooltipSelector: "#asri-enhance-customimage-saturation-tooltip-dark",
        event: "input",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-contrast-light",
        cssVar: "--asri-enhance-customimage-contrast-light",
        toCss: (raw: string | undefined) => raw ?? "1",
        inputSelector: "#asri-enhance-customimage-contrast-light",
        tooltipSelector: "#asri-enhance-customimage-contrast-tooltip-light",
        event: "input",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-contrast-dark",
        cssVar: "--asri-enhance-customimage-contrast-dark",
        toCss: (raw: string | undefined) => raw ?? "1",
        inputSelector: "#asri-enhance-customimage-contrast-dark",
        tooltipSelector: "#asri-enhance-customimage-contrast-tooltip-dark",
        event: "input",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-grayscale-light",
        cssVar: "--asri-enhance-customimage-grayscale-light",
        toCss: (raw: string | undefined) => raw ?? "0",
        inputSelector: "#asri-enhance-customimage-grayscale-light",
        tooltipSelector: "#asri-enhance-customimage-grayscale-tooltip-light",
        event: "input",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-grayscale-dark",
        cssVar: "--asri-enhance-customimage-grayscale-dark",
        toCss: (raw: string | undefined) => raw ?? "0",
        inputSelector: "#asri-enhance-customimage-grayscale-dark",
        tooltipSelector: "#asri-enhance-customimage-grayscale-tooltip-dark",
        event: "input",
        tooltipSuffix: "",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-hue-rotate-light",
        cssVar: "--asri-enhance-customimage-hue-rotate-light",
        toCss: (raw: string | undefined) => (raw ?? "0") + "deg",
        inputSelector: "#asri-enhance-customimage-hue-rotate-light",
        tooltipSelector: "#asri-enhance-customimage-hue-rotate-tooltip-light",
        event: "input",
        tooltipSuffix: "deg",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
    {
        configKey: "asri-enhance-customimage-hue-rotate-dark",
        cssVar: "--asri-enhance-customimage-hue-rotate-dark",
        toCss: (raw: string | undefined) => (raw ?? "0") + "deg",
        inputSelector: "#asri-enhance-customimage-hue-rotate-dark",
        tooltipSelector: "#asri-enhance-customimage-hue-rotate-tooltip-dark",
        event: "input",
        tooltipSuffix: "deg",
        valueFromConfig: (v: string) => v,
        valueToConfig: (v: string) => v,
    },
];
function getPreset(config: Record<string, any> | null | undefined, name: string): Record<string, any> {
    if (!config) return {};
    const key = name === "default" ? DEFAULT_PRESET_KEY : `asri-enhance-customimage-${name}`;
    const raw = config[key];
    if (raw && typeof raw === "object") {
        return raw as Record<string, any>;
    }
    return {};
}
function applyCustomImageCssFromConfig(config?: Record<string, any> | null): void {
    const style = document.documentElement.style;
    const currentName = (config?.[CURRENT_PRESET_KEY] as string) || "default";
    const preset = getPreset(config || null, currentName);
    for (const field of CUSTOM_IMAGE_FIELDS) {
        const raw = preset[field.configKey] as string | undefined;
        style.setProperty(field.cssVar, field.toCss(raw));
    }
}
function clearCustomImageCss(): void {
    const style = document.documentElement.style;
    for (const field of CUSTOM_IMAGE_FIELDS) {
        style.removeProperty(field.cssVar);
    }
}
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
                applyCustomImageCssFromConfig(newConfig);
            } else {
                document.documentElement.removeAttribute(DATA_ATTR);
                clearCustomImageCss();
            }
        }).catch(() => { });
    }).catch(() => { });
}
export function onCustomImageSettingsClick(plugin: Plugin, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dialog = new Dialog({
        title: plugin.i18n?.customimageSettings || "Custom Image Settings",
        content: `<div class="b3-dialog__content"><div class="fn__flex b3-label config__item">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimagePresetTip || "After modifying parameters, you need to update this preset or save as a new preset. Exiting the window directly will not save changes"}
    </div>
</div><div class="fn__flex b3-label config__item">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimagePresetSelect || "Preset"}
        <div class="b3-label__text">${plugin.i18n?.customimagePresetSelectTip || "Choose a saved preset"}</div>
    </div>
    <span class="fn__space"></span>
    <select class="b3-select fn__flex-center fn__size200" id="asri-enhance-customimage-preset-select">
      <option value="default">default</option>
    </select>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-path">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimagePath || "Image Path"}
        <div class="b3-label__text">${plugin.i18n?.customimagePathTip || "This plugin does not write any data, so only images already in the assets folder are supported. Enter a relative path here, which can be obtained from the image menu"}</div>
    </div>
    <span class="fn__space"></span>
    <input class="b3-text-field fn__flex-center fn__size200" id="asri-enhance-customimage-path" spellcheck="false">
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-blur">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageBlur || "Image Blur"}
        <div class="b3-label__text">${plugin.i18n?.customimageBlurTip || "Default: 0px"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-blur-tooltip" aria-label="0px">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-blur" max="50" min="0" step="1" type="range" value="0">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-frosted">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageFrosted || "磨砂效果"}
        <div class="b3-label__text">${plugin.i18n?.customimageFrostedTip || "使背景图具有磨砂质感"}</div>
    </div>
    <span class="fn__space"></span>
    <input class="b3-switch fn__flex-center" id="asri-enhance-customimage-frosted" type="checkbox">
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-opacity-light">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageOpacityLight || "Image Opacity (Light Mode)"}
        <div class="b3-label__text">${plugin.i18n?.customimageOpacityLightTip || "Default: 0.15"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-opacity-tooltip-light" aria-label="0.15">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-opacity-light" max="0.8" min="0" step="0.01" type="range" value="0.15">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-effect-light">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageEffectLight || "效果（明亮模式）"}
        <div class="b3-label__text">${plugin.i18n?.customimageEffectLightTip || "Default: Normal"}</div>
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
        <div class="b3-label__text">${plugin.i18n?.customimageOpacityDarkTip || "Default: 0.1"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-opacity-tooltip-dark" aria-label="0.1">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-opacity-dark" max="0.8" min="0" step="0.01" type="range" value="0.1">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-effect-dark">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageEffectDark || "效果（暗黑模式）"}
        <div class="b3-label__text">${plugin.i18n?.customimageEffectDarkTip || "Default: Normal"}</div>
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
        <div class="b3-label__text">${plugin.i18n?.customimagePositionXTip || "Default: 50%"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-x-tooltip" aria-label="50%">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-x" max="100" min="0" step="1" type="range" value="50">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-y">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimagePositionY || "Y Position"}
        <div class="b3-label__text">${plugin.i18n?.customimagePositionYTip || "Default: 50%"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-y-tooltip" aria-label="50%">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-y" max="100" min="0" step="1" type="range" value="50">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-brightness-light">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageBrightnessLight || "亮度（明亮模式）"}
        <div class="b3-label__text">${plugin.i18n?.customimageBrightnessLightTip || "Default: 1"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-brightness-tooltip-light" aria-label="1">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-brightness-light" max="1.5" min="0.5" step="0.01" type="range" value="1">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-brightness-dark">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageBrightnessDark || "亮度（暗黑模式）"}
        <div class="b3-label__text">${plugin.i18n?.customimageBrightnessDarkTip || "Default: 1"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-brightness-tooltip-dark" aria-label="1">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-brightness-dark" max="1.5" min="0.5" step="0.01" type="range" value="1">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-saturation-light">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageSaturationLight || "饱和度（明亮模式）"}
        <div class="b3-label__text">${plugin.i18n?.customimageSaturationLightTip || "Default: 1"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-saturation-tooltip-light" aria-label="1">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-saturation-light" max="2" min="0" step="0.01" type="range" value="1">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-saturation-dark">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageSaturationDark || "饱和度（暗黑模式）"}
        <div class="b3-label__text">${plugin.i18n?.customimageSaturationDarkTip || "Default: 1"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-saturation-tooltip-dark" aria-label="1">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-saturation-dark" max="2" min="0" step="0.01" type="range" value="1">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-contrast-light">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageContrastLight || "对比度（明亮模式）"}
        <div class="b3-label__text">${plugin.i18n?.customimageContrastLightTip || "Default: 1"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-contrast-tooltip-light" aria-label="1">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-contrast-light" max="2" min="0" step="0.01" type="range" value="1">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-contrast-dark">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageContrastDark || "对比度（暗黑模式）"}
        <div class="b3-label__text">${plugin.i18n?.customimageContrastDarkTip || "Default: 1"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-contrast-tooltip-dark" aria-label="1">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-contrast-dark" max="2" min="0" step="0.01" type="range" value="1">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-grayscale-light">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageGrayscaleLight || "灰度（明亮模式）"}
        <div class="b3-label__text">${plugin.i18n?.customimageGrayscaleLightTip || "Default: 0"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-grayscale-tooltip-light" aria-label="0">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-grayscale-light" max="1" min="0" step="0.01" type="range" value="0">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-grayscale-dark">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageGrayscaleDark || "灰度（暗黑模式）"}
        <div class="b3-label__text">${plugin.i18n?.customimageGrayscaleDarkTip || "Default: 0"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-grayscale-tooltip-dark" aria-label="0">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-grayscale-dark" max="1" min="0" step="0.01" type="range" value="0">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-hue-rotate-light">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageHueRotateLight || "色相偏移（明亮模式）"}
        <div class="b3-label__text">${plugin.i18n?.customimageHueRotateLightTip || "Default: 0deg"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-hue-rotate-tooltip-light" aria-label="0deg">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-hue-rotate-light" max="360" min="0" step="1" type="range" value="0">
    </div>
</div><div class="fn__flex b3-label config__item config__item-asri-enhance-customimage-hue-rotate-dark">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimageHueRotateDark || "色相偏移（暗黑模式）"}
        <div class="b3-label__text">${plugin.i18n?.customimageHueRotateDarkTip || "Default: 0deg"}</div>
    </div>
    <span class="fn__space"></span>
    <div class="b3-tooltips b3-tooltips__n fn__flex-center" id="asri-enhance-customimage-hue-rotate-tooltip-dark" aria-label="0deg">   
        <input class="b3-slider fn__size200" id="asri-enhance-customimage-hue-rotate-dark" max="360" min="0" step="1" type="range" value="0">
    </div>
</div></div><div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel" id="asri-enhance-customimage-toggle-detail">${plugin.i18n?.customimageShowDetail || "显示详细参数"}</button>
    <div class="fn__space"></div>
    <button class="b3-button b3-button--cancel" id="asri-enhance-customimage-reset-preset">${plugin.i18n?.customimageResetPreset || "Reset to defaults"}</button>
</div><div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel" id="asri-enhance-customimage-cancel">${plugin.i18n?.cancel || "Cancel"}</button>
    <div class="fn__space"></div>
    <button class="b3-button b3-button--remove" id="asri-enhance-customimage-delete-preset">${plugin.i18n?.customimageDeletePreset || "Delete this preset"}</button>
    <div class="fn__space"></div>
    <button class="b3-button b3-button--text" id="asri-enhance-customimage-update-preset">${plugin.i18n?.customimageUpdatePreset || "Update current preset"}</button>
    <div class="fn__space"></div>
    <button class="b3-button b3-button--text" id="asri-enhance-customimage-save-preset">${plugin.i18n?.customimageSavePreset || "Save as preset"}</button>
</div>`,
        width: "90vw",
        height: "90vh",
    });
    const dialogContainer = dialog.element.querySelector(".b3-dialog__container") as HTMLElement;
    if (dialogContainer) {
        dialogContainer.style.maxWidth = "700px";
    }
    dialog.element.setAttribute("data-key", "dialog-asri-enhance-customimage-settings");
    const presetSelect = dialog.element.querySelector("#asri-enhance-customimage-preset-select") as HTMLSelectElement | null;
    const fieldDom = CUSTOM_IMAGE_FIELDS.map(field => {
        const input = field.inputSelector
            ? (dialog.element.querySelector(field.inputSelector) as HTMLInputElement | HTMLSelectElement | null)
            : null;
        const tooltip = field.tooltipSelector
            ? (dialog.element.querySelector(field.tooltipSelector) as HTMLElement | null)
            : null;
        return { field, input, tooltip };
    });
    const buildPresetFromDom = (): Record<string, any> => {
        const preset: Record<string, any> = {};
        for (const { field, input } of fieldDom) {
            if (!input) continue;
            let rawInput: string;
            if (input instanceof HTMLInputElement && input.type === "checkbox") {
                rawInput = input.checked ? "true" : "false";
            } else {
                rawInput = (input as HTMLInputElement | HTMLSelectElement).value;
            }
            const configRaw = field.valueToConfig ? field.valueToConfig(rawInput) : rawInput;
            preset[field.configKey] = configRaw;
        }
        return preset;
    };
    loadData(plugin, CONFIG_FILE).then((config) => {
        const currentPresetName = (config?.[CURRENT_PRESET_KEY] as string) || "default";
        const hasDefaultPreset = !!(config && config[DEFAULT_PRESET_KEY]);
        if (presetSelect) {
            presetSelect.innerHTML = "";
            const addOption = (value: string) => {
                const opt = document.createElement("option");
                opt.value = value;
                opt.textContent = value;
                presetSelect.appendChild(opt);
            };
            if (!hasDefaultPreset) {
                addOption("default");
            }
            if (config) {
                Object.keys(config).forEach((key) => {
                    if (!key.startsWith("asri-enhance-customimage-")) return;
                    if (key === CURRENT_PRESET_KEY) return;
                    const name =
                        key === DEFAULT_PRESET_KEY
                            ? "default"
                            : key.replace("asri-enhance-customimage-", "");
                    if (!name) return;
                    if (!Array.from(presetSelect.options).some(o => o.value === name)) {
                        addOption(name);
                    }
                });
            }
            const options = Array.from(presetSelect.options);
            if (options.some(o => o.value === currentPresetName)) {
                presetSelect.value = currentPresetName;
            } else if (options.length > 0) {
                presetSelect.value = options[0].value;
            }
        }
        const preset = getPreset(config || null, currentPresetName);
        for (const { field, input, tooltip } of fieldDom) {
            if (!input) continue;
            const raw = preset[field.configKey] as string | undefined;
            if (raw === undefined || raw === "") continue;
            const inputValue = field.valueFromConfig ? field.valueFromConfig(raw) : raw;
            if (input instanceof HTMLInputElement && input.type === "checkbox") {
                input.checked = inputValue === "true";
            } else {
                (input as HTMLInputElement | HTMLSelectElement).value = inputValue;
            }
            if (tooltip && "tooltipSuffix" in field && field.tooltipSuffix !== undefined) {
                tooltip.setAttribute("aria-label", inputValue + field.tooltipSuffix);
            }
        }
    }).catch(() => {});
    const style = document.documentElement.style;
    for (const { field, input, tooltip } of fieldDom) {
        if (!input || !field.event) continue;
        input.addEventListener(field.event, () => {
            let rawInput: string;
            if (input instanceof HTMLInputElement && input.type === "checkbox") {
                rawInput = input.checked ? "true" : "false";
            } else {
                rawInput = (input as HTMLInputElement | HTMLSelectElement).value;
            }
            const configRaw = field.valueToConfig ? field.valueToConfig(rawInput) : rawInput;
            if (tooltip && "tooltipSuffix" in field && field.tooltipSuffix !== undefined) {
                tooltip.setAttribute("aria-label", rawInput + field.tooltipSuffix);
            }
            style.setProperty(field.cssVar, field.toCss(configRaw));
        });
    }
    const deletePresetButton = dialog.element.querySelector("#asri-enhance-customimage-delete-preset") as HTMLButtonElement | null;
    const cancelButton = dialog.element.querySelector("#asri-enhance-customimage-cancel") as HTMLButtonElement | null;
    const toggleDetailButton = dialog.element.querySelector("#asri-enhance-customimage-toggle-detail") as HTMLButtonElement | null;
    const resetPresetButton = dialog.element.querySelector("#asri-enhance-customimage-reset-preset") as HTMLButtonElement | null;
    const updatePresetButton = dialog.element.querySelector("#asri-enhance-customimage-update-preset") as HTMLButtonElement | null;
    const savePresetButton = dialog.element.querySelector("#asri-enhance-customimage-save-preset") as HTMLButtonElement | null;
    let isDetailVisible = false;
    toggleDetailButton?.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        isDetailVisible = !isDetailVisible;
        if (isDetailVisible) {
            toggleDetailButton.textContent = plugin.i18n?.customimageHideDetail || "隐藏详细参数";
            dialog.element.classList.add("asri-enhance-customimage-detail");
        } else {
            toggleDetailButton.textContent = plugin.i18n?.customimageShowDetail || "显示详细参数";
            dialog.element.classList.remove("asri-enhance-customimage-detail");
        }
    });
    resetPresetButton?.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        for (const { field, input, tooltip } of fieldDom) {
            if (!input) continue;
            if (field.configKey === "asri-enhance-customimage-url") continue;
            const defaultValue = field.toCss(undefined);
            let displayValue = defaultValue;
            if (input instanceof HTMLInputElement && input.type === "checkbox") {
                input.checked = defaultValue === "block";
            } else {
                if (field.tooltipSuffix && defaultValue.endsWith(field.tooltipSuffix)) {
                    displayValue = defaultValue.slice(0, -field.tooltipSuffix.length);
                }
                (input as HTMLInputElement | HTMLSelectElement).value = displayValue;
            }
            if (tooltip && "tooltipSuffix" in field && field.tooltipSuffix !== undefined) {
                tooltip.setAttribute("aria-label", defaultValue);
            }
            style.setProperty(field.cssVar, defaultValue);
        }
    });
    cancelButton?.addEventListener("click", () => {
        dialog.destroy();
    });
    deletePresetButton?.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!presetSelect) return;
        const name = presetSelect.value || "default";
        if (name === "default") {
            void (async () => {
                try {
                    await fetch("/api/notification/pushMsg", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            msg: plugin.i18n?.customimagePresetDeleteForbidden || "The \"default\" preset cannot be deleted",
                            timeout: 3000,
                        }),
                    });
                } catch {
                }
            })();
            return;
        }
        const title = plugin.i18n?.customimagePresetDeleteConfirmTitle || "Confirm delete?";
        const contentTemplate = plugin.i18n?.customimagePresetDeleteConfirmContent || "Preset \"${name}\" will be deleted";
        const contentText = contentTemplate.replace("${name}", name);
        const confirmDialog = new Dialog({
            title,
            content: `<div class="b3-dialog__content">${contentText}</div><div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel" id="asri-enhance-customimage-delete-cancel">${plugin.i18n?.cancel || "Cancel"}</button>
    <div class="fn__space"></div>
    <button class="b3-button b3-button--text" id="asri-enhance-customimage-delete-confirm">${plugin.i18n?.confirm || "Confirm"}</button>
</div>`,
            width: "max(360px, 30vw)",
        });
        confirmDialog.element.querySelector("#asri-enhance-customimage-delete-cancel")?.addEventListener("click", () => {
            confirmDialog.destroy();
        });
        confirmDialog.element.querySelector("#asri-enhance-customimage-delete-confirm")?.addEventListener("click", async () => {
            try {
                const config = await loadData(plugin, CONFIG_FILE);
                const key = `asri-enhance-customimage-${name}`;
                const finalConfig: Record<string, any> = { ...config, [CURRENT_PRESET_KEY]: "default" };
                delete finalConfig[key];
                await saveData(plugin, CONFIG_FILE, finalConfig);
                if (presetSelect) {
                    const option = Array.from(presetSelect.options).find(o => o.value === name);
                    if (option) {
                        presetSelect.removeChild(option);
                    }
                    if (Array.from(presetSelect.options).some(o => o.value === "default")) {
                        presetSelect.value = "default";
                    } else if (presetSelect.options.length > 0) {
                        presetSelect.value = presetSelect.options[0].value;
                    }
                }
                const defaultPreset = getPreset(finalConfig, "default");
                for (const { field, input, tooltip } of fieldDom) {
                    if (!input) continue;
                    const raw = defaultPreset[field.configKey] as string | undefined;
                    const inputValue = raw !== undefined && raw !== "" ? (field.valueFromConfig ? field.valueFromConfig(raw) : raw) : "";
                    if (input instanceof HTMLInputElement && input.type === "checkbox") {
                        input.checked = inputValue === "true";
                    } else {
                        (input as HTMLInputElement | HTMLSelectElement).value = inputValue;
                    }
                    if (tooltip && "tooltipSuffix" in field && field.tooltipSuffix !== undefined) {
                        const labelValue = inputValue || "";
                        tooltip.setAttribute("aria-label", labelValue + field.tooltipSuffix);
                    }
                }
                applyCustomImageCssFromConfig(finalConfig);
                try {
                    const msgTemplate = plugin.i18n?.customimagePresetDeleted || "Preset \"${name}\" has been deleted";
                    const msg = msgTemplate.replace("${name}", name);
                    await fetch("/api/notification/pushMsg", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            msg,
                            timeout: 3000,
                        }),
                    });
                } catch {
                }
            } catch {
            } finally {
                confirmDialog.destroy();
            }
        });
    });
    updatePresetButton?.addEventListener("click", async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!presetSelect) return;
        const name = presetSelect.value || "default";
        try {
            const config = await loadData(plugin, CONFIG_FILE);
            const currentPresetFromUi = buildPresetFromDom();
            const key =
                name === "default"
                    ? DEFAULT_PRESET_KEY
                    : `asri-enhance-customimage-${name}`;
            const finalConfig = {
                ...config,
                [key]: currentPresetFromUi,
            };
            await saveData(plugin, CONFIG_FILE, finalConfig);
            try {
                const msgTemplate = plugin.i18n?.customimagePresetUpdated || "Preset \"${name}\" has been updated";
                const msg = msgTemplate.replace("${name}", name);
                await fetch("/api/notification/pushMsg", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        msg,
                        timeout: 3000,
                    }),
                });
            } catch {
            }
        } catch {
        }
    });
    savePresetButton?.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const presetDialog = new Dialog({
            title: plugin.i18n?.customimageSavePresetTitle || "保存当前参数为方案",
            content: `<div class="b3-dialog__content"><div class="fn__flex b3-label config__item">
    <div class="fn__flex-1">
        ${plugin.i18n?.customimagePresetName || "方案名称"}
        <div class="b3-label__text">${plugin.i18n?.customimagePresetNameTip || "填入方案名称"}</div>
    </div>
    <span class="fn__space"></span>
    <input class="b3-text-field fn__flex-center fn__size200" id="asri-enhance-customimage-preset-name" spellcheck="false">
</div></div><div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel" id="asri-enhance-customimage-preset-cancel">${plugin.i18n?.cancel || "Cancel"}</button>
    <div class="fn__space"></div>
    <button class="b3-button b3-button--text" id="asri-enhance-customimage-preset-confirm">${plugin.i18n?.confirm || "Confirm"}</button>
</div>`,
            width: "max(480px, 30vw)",
        });
        presetDialog.element.querySelector("#asri-enhance-customimage-preset-cancel")?.addEventListener("click", () => {
            presetDialog.destroy();
        });
        presetDialog.element.querySelector("#asri-enhance-customimage-preset-confirm")?.addEventListener("click", async () => {
            const input = presetDialog.element.querySelector("#asri-enhance-customimage-preset-name") as HTMLInputElement | null;
            const name = input?.value.trim();
            if (!name) {
                try {
                    await fetch("/api/notification/pushMsg", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            msg: plugin.i18n?.customimagePresetNameEmpty || "Preset name cannot be empty",
                            timeout: 3000,
                        }),
                    });
                } catch {
                }
                return;
            }
            if (name === "current") {
                try {
                    await fetch("/api/notification/pushMsg", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            msg: plugin.i18n?.customimagePresetNameReserved || "Preset name cannot be \"current\"",
                            timeout: 3000,
                        }),
                    });
                } catch {
                }
                return;
            }
            try {
                const config = await loadData(plugin, CONFIG_FILE);
                const currentPresetFromUi = buildPresetFromDom();
                const presetKey = `asri-enhance-customimage-${name}`;
                const isExisting = config && config[presetKey] !== undefined;
                const finalConfig = {
                    ...config,
                    [presetKey]: currentPresetFromUi,
                };
                await saveData(plugin, CONFIG_FILE, finalConfig);
                try {
                    const msgTemplate = isExisting
                        ? (plugin.i18n?.customimagePresetUpdated || "Preset \"${name}\" has been updated")
                        : (plugin.i18n?.customimagePresetSaved || "Preset \"${name}\" has been saved");
                    const msg = msgTemplate.replace("${name}", name);
                    await fetch("/api/notification/pushMsg", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            msg,
                            timeout: 3000,
                        }),
                    });
                } catch {
                }
            } catch {
            } finally {
                if (presetSelect) {
                    const exists = Array.from(presetSelect.options).some(o => o.value === name);
                    if (!exists) {
                        const opt = document.createElement("option");
                        opt.value = name;
                        opt.textContent = name;
                        presetSelect.appendChild(opt);
                    }
                }
                presetDialog.destroy();
            }
        });
    });
    presetSelect?.addEventListener("change", async () => {
        const name = presetSelect.value || "default";
        try {
            const config = await loadData(plugin, CONFIG_FILE);
            const selectedPreset = getPreset(config, name);
            const finalConfig = {
                ...config,
                [CURRENT_PRESET_KEY]: name,
            };
            await saveData(plugin, CONFIG_FILE, finalConfig);
            for (const { field, input, tooltip } of fieldDom) {
                if (!input) continue;
                const raw = selectedPreset[field.configKey] as string | undefined;
                const inputValue = raw !== undefined && raw !== "" ? (field.valueFromConfig ? field.valueFromConfig(raw) : raw) : "";
                if (input instanceof HTMLInputElement && input.type === "checkbox") {
                    input.checked = inputValue === "true";
                } else {
                    (input as HTMLInputElement | HTMLSelectElement).value = inputValue;
                }
                if (tooltip && "tooltipSuffix" in field && field.tooltipSuffix !== undefined) {
                    const labelValue = inputValue || "";
                    tooltip.setAttribute("aria-label", labelValue + field.tooltipSuffix);
                }
            }
            applyCustomImageCssFromConfig(finalConfig);
        } catch {
        }
    });
}export async function applyCustomImageConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    const enabled = configData?.[CONFIG_KEY];
    const otherEnabled = OTHER_CONFIG_KEYS.some(key => 
        configData?.[key] === true || configData?.[key] === "true"
    );
    if (enabled === true || enabled === "true") {
        if (!otherEnabled) {
            htmlEl.setAttribute(DATA_ATTR, "true");
            applyCustomImageCssFromConfig(configData);
        } else {
            htmlEl.removeAttribute(DATA_ATTR);
            clearCustomImageCss();
        }
    } else {
        htmlEl.removeAttribute(DATA_ATTR);
        clearCustomImageCss();
    }
}
export function removeCustomImageConfig(): void {
    document.documentElement.removeAttribute(DATA_ATTR);
    clearCustomImageCss();
}
