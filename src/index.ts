import { Plugin } from "siyuan";
import { ThemeChangeObserver, removeAsriEnhanceEnable } from "./utils/guard";
import { listenBarModeClick, addAsriEnhanceItems, type Unsubscribe } from "./menu/additems";
import { addMobileBarModeBtn } from "./menu/additems-mobile";
import { applyAmberConfig } from "./palette/amber";
import { applySakuraConfig } from "./palette/sakura";
import { applyWildernessConfig } from "./palette/wilderness";
import { applyMidnightConfig } from "./palette/midnight";
import { applyOceanConfig } from "./palette/ocean";
import { applyDuskConfig } from "./palette/dusk";
import { applyTwilightConfig } from "./palette/twilight";
import { applyLavenderConfig } from "./palette/lavender";
import { applyOpaliteConfig } from "./palette/opalite";
import { applyOxygenConfig } from "./palette/oxygen";
import { applyGingkoConfig } from "./palette/gingko";
import { applyTitaniumspaceConfig } from "./palette/titaniumspace";
import { applyTundraConfig } from "./palette/tundra";
import { applyFireflyConfig } from "./palette/firefly";
import { applySongyanConfig } from "./palette/songyan";
import { applyStarryConfig } from "./palette/starry";
import { applyAbyssConfig } from "./palette/abyss";
import { applyVioletConfig } from "./palette/violet";
import { applyLakesideConfig } from "./palette/lakeside";
import { applyColoredHeadingConfig } from "./detail/coloredheading";
import { applyColoredTreeConfig } from "./detail/coloredtree";
import { applyColoredListConfig } from "./detail/coloredlist";
import { applyListBulletLineConfig, removeListBulletLineEffect } from "./more/listbulletline";
import { applySidememoConfig, onSideMemoClick, stopObserver as stopSidememoObserver, removeAllSidememoArtifacts } from "./more/sidememo";
import { applyGlobalFrostedGlassConfig } from "./detail/globalfrostedglass";
import { applySidebarTopStickyConfig } from "./detail/sidebartopsticky";
import { applyMoreAnimationsConfig } from "./detail/moreanimations";
import { applyMulticolSlashMenuConfig } from "./detail/multicolslashmenu";
import { applyCardSearchListConfig } from "./detail/cardsearchlist";
import { applySmoothCaretConfig, destroySmoothCaret } from "./immersive/smoothcaret";
import { applyFluidCursorConfig, destroyFluidCursor } from "./immersive/fluidcursor";
import { applyPinnedToolbarConfig, destroyPinnedToolbar } from "./immersive/pinnedtoolbar";
import { applyNewsprintConfig } from "./texture/newsprint";
import { applyNoiseConfig } from "./texture/noise";
import { applyAcrylicConfig } from "./texture/acrylic";
import { applyCheckerboardConfig } from "./texture/checkerboard";
import { applyGridConfig } from "./texture/grid";
import { applyCrossDotConfig } from "./texture/crossdot";
import { applyWoodConfig } from "./texture/wood";
import { applyCamouflageConfig } from "./texture/camouflage";
import { applyGranuleConfig } from "./texture/granule";
import { applyFeatheryConfig } from "./texture/feathery";
import { applyVelvetConfig } from "./texture/velvet";
import { applyEmbossedpaperConfig } from "./texture/embossedpaper";
import { applyCustomImageConfig, removeCustomImageConfig } from "./texture/customimage";
import { applyTypewriterModeConfig, destroyTypewriterMode, onTypewriterModeClick } from "./immersive/typewriter";
import { applyFocusModeConfig, onFocusModeClick } from "./immersive/focus";
import { applyFocusBlockIndicatorConfig, destroyFocusBlockIndicator } from "./more/focusblockindicator";
import { applyScrollEffectConfig, destroyScrollEffect } from "./immersive/scrolleffect";
import { applyFollowTimeConfig } from "./followtime/followtime";
import { removePaletteConfig, clearAllPluginConfig, PALETTE_NAMES, disableAllPalettesForCurrentTheme } from "./palette/manager";
import { loadData } from "./utils/storage";
import { removeFollowTimeConfig } from "./followtime/followtime";
class AsriEnhancePlugin extends Plugin {
    private unsubscribeBarModeClick: Unsubscribe | null = null;
    private asriConfigClickHandler: ((event: MouseEvent) => void) | null = null;
    private themeModeObserver: MutationObserver | null = null;
    private NewThemeChangeObserver: MutationObserver | null = null;
    private themeModeChangeTimers: number[] = [];
    private paletteDisableMouseUpHandler: ((event: MouseEvent) => void) | null = null;
    private paletteDisableDebounceTimer: number | null = null;
    private async applyAllConfigs(config?: Record<string, any> | null): Promise<void> {
        await Promise.all([
            applyAmberConfig(this, config).catch(() => { }),
            applySakuraConfig(this, config).catch(() => { }),
            applyWildernessConfig(this, config).catch(() => { }),
            applyMidnightConfig(this, config).catch(() => { }),
            applyOceanConfig(this, config).catch(() => { }),
            applyDuskConfig(this, config).catch(() => { }),
            applyTwilightConfig(this, config).catch(() => { }),
            applyLavenderConfig(this, config).catch(() => { }),
            applyOpaliteConfig(this, config).catch(() => { }),
            applyOxygenConfig(this, config).catch(() => { }),
            applyGingkoConfig(this, config).catch(() => { }),
            applyTitaniumspaceConfig(this, config).catch(() => { }),
            applyTundraConfig(this, config).catch(() => { }),
            applyFireflyConfig(this, config).catch(() => { }),
            applySongyanConfig(this, config).catch(() => { }),
            applyStarryConfig(this, config).catch(() => { }),
            applyAbyssConfig(this, config).catch(() => { }),
            applyVioletConfig(this, config).catch(() => { }),
            applyLakesideConfig(this, config).catch(() => { }),
            applyColoredHeadingConfig(this, config).catch(() => { }),
            applyColoredTreeConfig(this, config).catch(() => { }),
            applyColoredListConfig(this, config).catch(() => { }),
            applyListBulletLineConfig(this, config).catch(() => { }),
            applySidememoConfig(this, config).catch(() => { }),
            applyGlobalFrostedGlassConfig(this, config).catch(() => { }),
            applySidebarTopStickyConfig(this, config).catch(() => { }),
            applyMoreAnimationsConfig(this, config).catch(() => { }),
            applyMulticolSlashMenuConfig(this, config).catch(() => { }),
            applyCardSearchListConfig(this, config).catch(() => { }),
            applySmoothCaretConfig(this, config).catch(() => { }),
            applyFluidCursorConfig(this, config).catch(() => { }),
            applyPinnedToolbarConfig(this, config).catch(() => { }),
            applyNewsprintConfig(this, config).catch(() => { }),
            applyNoiseConfig(this, config).catch(() => { }),
            applyAcrylicConfig(this, config).catch(() => { }),
            applyCheckerboardConfig(this, config).catch(() => { }),
            applyGridConfig(this, config).catch(() => { }),
            applyCrossDotConfig(this, config).catch(() => { }),
            applyWoodConfig(this, config).catch(() => { }),
            applyCamouflageConfig(this, config).catch(() => { }),
            applyGranuleConfig(this, config).catch(() => { }),
            applyFeatheryConfig(this, config).catch(() => { }),
            applyVelvetConfig(this, config).catch(() => { }),
            applyEmbossedpaperConfig(this, config).catch(() => { }),
            applyCustomImageConfig(this, config).catch(() => { }),
            applyTypewriterModeConfig(this, config).catch(() => { }),
            applyFocusModeConfig(this, config).catch(() => { }),
            applyFocusBlockIndicatorConfig(this, config).catch(() => { }),
            applyScrollEffectConfig(this, config).catch(() => { }),
            applyFollowTimeConfig(this, config).catch(() => { }),
        ]);
    }
    async onload() {
        this.NewThemeChangeObserver = ThemeChangeObserver();
        this.unsubscribeBarModeClick = listenBarModeClick(this, (event) => addAsriEnhanceItems(this, event));
        addMobileBarModeBtn(this);
        this.asriConfigClickHandler = (event: MouseEvent) => {
            queueMicrotask(() => {
                const target = event.target as HTMLElement;
                if (!target)
                    return;
                if (PALETTE_NAMES.some(palette => target.closest(`#asri-enhance-${palette}`))) {
                    return;
                }
                const asriConfig = target.closest(".asri-config");
                if (asriConfig && asriConfig.id !== "topbarFusionPlus" && asriConfig.id !== "asriChroma") {
                    PALETTE_NAMES.forEach((palette) => {
                        removePaletteConfig(this, palette, "config.json").catch(() => {
                        });
                    });
                    removeFollowTimeConfig(this, "config.json").catch(() => {
                    });
                }
            });
        };
        document.addEventListener("click", this.asriConfigClickHandler, true);
        this.paletteDisableMouseUpHandler = (event: MouseEvent) => {
            queueMicrotask(() => {
                const target = event.target as HTMLElement;
                if (!target)
                    return;
                const shouldDisable = target.id?.startsWith("prst-palette") ||
                    target.closest("[id^='prst-palette']") !== null ||
                    target.id === "pickColor" ||
                    target.closest("#pickColor") !== null ||
                    target.id === "followSysAccent" ||
                    target.closest("#followSysAccent") !== null ||
                    target.id === "followCoverImgColor" ||
                    target.closest("#followCoverImgColor") !== null;
                if (shouldDisable) {
                    if (this.paletteDisableDebounceTimer !== null) {
                        clearTimeout(this.paletteDisableDebounceTimer);
                    }
                    let paletteName: string | null = null;
                    if (target.id?.startsWith("prst-palette")) {
                        paletteName = target.id.replace("prst-palette-", "");
                    } else {
                        const closestPrstPalette = target.closest("[id^='prst-palette']");
                        if (closestPrstPalette) {
                            paletteName = closestPrstPalette.id.replace("prst-palette-", "");
                        }
                    }
                    this.paletteDisableDebounceTimer = window.setTimeout(() => {
                        disableAllPalettesForCurrentTheme(this, "config.json").then(() => {
                            removeFollowTimeConfig(this, "config.json").then(() => {
                                if (paletteName) {
                                    const htmlEl = document.documentElement;
                                    if (htmlEl) {
                                        const currentPalette = Array.from(htmlEl.classList).find(cls => cls.startsWith("asri-palette-"));
                                        if (currentPalette !== `asri-palette-${paletteName}`) {
                                            Array.from(htmlEl.classList)
                                                .filter(cls => cls.startsWith("asri-palette-"))
                                                .forEach(cls => htmlEl.classList.remove(cls));
                                            htmlEl.classList.add(`asri-palette-${paletteName}`);
                                        }
                                    }
                                }
                                loadData(this, "config.json").then((newConfig) => {
                                    this.applyAllConfigs(newConfig).catch(() => { });
                                }).catch(() => { });
                            }).catch(() => { });
                        }).catch(() => { });
                        this.paletteDisableDebounceTimer = null;
                    }, 200);
                }
            });
        };
        document.addEventListener("mouseup", this.paletteDisableMouseUpHandler, false);
        const config = await loadData(this, "config.json");
        const htmlEl = document.documentElement;
        if (htmlEl) {
            this.themeModeObserver = new MutationObserver((mutations) => {
                queueMicrotask(() => {
                    for (const mutation of mutations) {
                        if (mutation.type === "attributes" && mutation.attributeName === "data-theme-mode") {
                            this.themeModeChangeTimers.forEach((timer) => {
                                clearTimeout(timer);
                            });
                            this.themeModeChangeTimers = [];
                            loadData(this, "config.json").then((newConfig) => {
                                this.applyAllConfigs(newConfig).catch(() => { });
                            }).catch(() => { });
                            const timer100 = window.setTimeout(() => {
                                loadData(this, "config.json").then((newConfig) => {
                                    this.applyAllConfigs(newConfig).catch(() => { });
                                }).catch(() => { });
                            }, 100);
                            this.themeModeChangeTimers.push(timer100);
                            const timer500 = window.setTimeout(() => {
                                loadData(this, "config.json").then((newConfig) => {
                                    this.applyAllConfigs(newConfig).catch(() => { });
                                }).catch(() => { });
                            }, 500);
                            this.themeModeChangeTimers.push(timer500);
                        }
                    }
                });
            });
            this.themeModeObserver.observe(htmlEl, {
                attributes: true,
                attributeFilter: ["data-theme-mode"],
            });
        }
        await this.applyAllConfigs(config);
        (this as any).addCommand({
            langKey: "asri-enhance-typewriter",
            langText: this.i18n.typewriter,
            hotkey: "",
            callback: () => {
                onTypewriterModeClick(this);
            },
        });
        (this as any).addCommand({
            langKey: "asri-enhance-focus",
            langText: this.i18n.focus,
            hotkey: "",
            callback: () => {
                onFocusModeClick(this);
            },
        });
        (this as any).addCommand({
            langKey: "asri-enhance-sidememo",
            langText: this.i18n.sidememo,
            hotkey: "",
            callback: () => {
                onSideMemoClick(this);
            },
        });
        setTimeout(() => {
            this.applyAllConfigs(config).catch(() => { });
        }, 100);
        setTimeout(() => {
            this.applyAllConfigs(config).catch(() => { });
        }, 500);
    }
    onunload() {
        if (this.unsubscribeBarModeClick) {
            this.unsubscribeBarModeClick();
            this.unsubscribeBarModeClick = null;
        }
        if (this.asriConfigClickHandler) {
            document.removeEventListener("click", this.asriConfigClickHandler, true);
            this.asriConfigClickHandler = null;
        }
        if (this.themeModeObserver) {
            this.themeModeObserver.disconnect();
            this.themeModeObserver = null;
        }
        if (this.NewThemeChangeObserver) {
            this.NewThemeChangeObserver.disconnect();
            this.NewThemeChangeObserver = null;
        }
        this.themeModeChangeTimers.forEach((timer) => {
            clearTimeout(timer);
        });
        this.themeModeChangeTimers = [];
        if (this.paletteDisableMouseUpHandler) {
            document.removeEventListener("mouseup", this.paletteDisableMouseUpHandler, true);
            this.paletteDisableMouseUpHandler = null;
        }
        if (this.paletteDisableDebounceTimer !== null) {
            clearTimeout(this.paletteDisableDebounceTimer);
            this.paletteDisableDebounceTimer = null;
        }
        removeListBulletLineEffect();
        removeAllSidememoArtifacts();
        stopSidememoObserver();
        destroySmoothCaret();
        destroyFluidCursor();
        destroyPinnedToolbar();
        destroyTypewriterMode();
        destroyFocusBlockIndicator();
        removeCustomImageConfig();
        const htmlEl = document.documentElement;
        if (htmlEl) {
            const attrs = Array.from(htmlEl.attributes);
            attrs.forEach(attr => {
                if (attr.name.startsWith("data-asri-enhance-")) {
                    htmlEl.removeAttribute(attr.name);
                }
            });
            removeAsriEnhanceEnable();
        }
    }
    async uninstall() {
        this.onunload();
        await clearAllPluginConfig(this, "config.json").catch(() => {
        });
    }
}
export = AsriEnhancePlugin;
