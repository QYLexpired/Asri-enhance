import { Plugin } from "siyuan";
import { listenBarModeClick, addMoreAfterTopbarFusionPlus, type Unsubscribe } from "./menu/additems";
import { applyAmberConfig } from "./palette/amber";
import { applySakuraConfig } from "./palette/sakura";
import { applyWildernessConfig } from "./palette/wilderness";
import { applyMidnightConfig } from "./palette/midnight";
import { applySaltConfig } from "./palette/salt";
import { applyRosepineConfig } from "./palette/rosepine";
import { applyTopazConfig } from "./palette/topaz";
import { applyOxygenConfig } from "./palette/oxygen";
import { applyShadeConfig } from "./palette/shade";
import { applyGruvboxConfig } from "./palette/gruvbox";
import { applyGlitchConfig } from "./palette/glitch";
import { applyNostalgiaConfig } from "./palette/nostalgia";
import { applyColoredHeadingConfig } from "./detail/coloredheading";
import { applyColoredTreeConfig } from "./detail/coloredtree";
import { applyColoredListConfig } from "./detail/coloredlist";
import { applyHeadingLevelHintConfig } from "./detail/headinglevelhint";
import { applyListBulletLineConfig, removeListBulletLineEffect } from "./more/listbulletline";
import { applyVerticalTabConfig, stopObserver as stopVerticalTabObserver } from "./more/verticaltab";
import { applySidememoConfig, stopObserver as stopSidememoObserver, removeAllSidememoArtifacts } from "./more/sidememo";
import { applyGlobalFrostedGlassConfig } from "./detail/globalfrostedglass";
import { applySidebarTopStickyConfig } from "./detail/sidebartopsticky";
import { applyHideTabConfig } from "./detail/hidetab";
import { applyHideBreadcrumbConfig } from "./detail/hidebreadcrumb";
import { applyMoreAnimationsConfig } from "./detail/moreanimations";
import { applySingleColumnSlashMenuConfig } from "./detail/singlecolumnslashmenu";
import { applyCardSearchListConfig } from "./detail/cardsearchlist";
import { applyWindowTransparencyValueConfig } from "./detail/windowtransparencyvalue";
import { applyWholeWindowTransparencyConfig } from "./detail/wholewindowtransparency";
import { applySmoothCaretConfig, destroySmoothCaret } from "./more/smoothcaret";
import { applyFluidCursorConfig, destroyFluidCursor } from "./more/fluidcursor";
import { applyIslandLayoutConfig, restoreMacTrafficLights } from "./more/islandlayout";
import { applyPaperConfig } from "./texture/paper";
import { applyNoiseConfig } from "./texture/noise";
import { applyAcrylicConfig } from "./texture/acrylic";
import { applyCheckerboardConfig } from "./texture/checkerboard";
import { applyGridConfig } from "./texture/grid";
import { applyPolkaDotConfig } from "./texture/polkadot";
import { applyCrossDotConfig } from "./texture/crossdot";
import { applyHoneycombConfig } from "./texture/honeycomb";
import { applyWoodConfig } from "./texture/wood";
import { applyCamouflageConfig } from "./texture/camouflage";
import { applyFiberConfig } from "./texture/fiber";
import { applyFabricConfig } from "./texture/fabric";
import { applyFollowTimeConfig } from "./followtime/followtime";
import { removePaletteConfig, clearAllPluginConfig, PALETTE_NAMES, loadData, disableAllPalettesForCurrentTheme } from "./utils/storage";
import { removeFollowTimeConfig } from "./followtime/followtime";
import { initSlashNavi, destroySlashNavi } from "./module/slashnavi";
class AsriEnhancePlugin extends Plugin {
    private unsubscribeBarModeClick: Unsubscribe | null = null;
    private unsubscribeTopbarFusionPlus: Unsubscribe | null = null;
    private asriConfigClickHandler: ((event: MouseEvent) => void) | null = null;
    private themeModeObserver: MutationObserver | null = null;
    private themeModeChangeTimers: number[] = [];
    private paletteDisableMouseUpHandler: ((event: MouseEvent) => void) | null = null;
    private paletteDisableDebounceTimer: number | null = null;
    private async applyAllConfigs(config?: Record<string, any> | null): Promise<void> {
        await Promise.all([
            applyAmberConfig(this, config).catch(() => { }),
            applySakuraConfig(this, config).catch(() => { }),
            applyWildernessConfig(this, config).catch(() => { }),
            applyMidnightConfig(this, config).catch(() => { }),
            applySaltConfig(this, config).catch(() => { }),
            applyRosepineConfig(this, config).catch(() => { }),
            applyTopazConfig(this, config).catch(() => { }),
            applyOxygenConfig(this, config).catch(() => { }),
            applyShadeConfig(this, config).catch(() => { }),
            applyGruvboxConfig(this, config).catch(() => { }),
            applyGlitchConfig(this, config).catch(() => { }),
            applyNostalgiaConfig(this, config).catch(() => { }),
            applyColoredHeadingConfig(this, config).catch(() => { }),
            applyColoredTreeConfig(this, config).catch(() => { }),
            applyColoredListConfig(this, config).catch(() => { }),
            applyHeadingLevelHintConfig(this, config).catch(() => { }),
            applyListBulletLineConfig(this, config).catch(() => { }),
            applyVerticalTabConfig(this, config).catch(() => { }),
            applySidememoConfig(this, config).catch(() => { }),
            applyGlobalFrostedGlassConfig(this, config).catch(() => { }),
            applySidebarTopStickyConfig(this, config).catch(() => { }),
            applyHideTabConfig(this, config).catch(() => { }),
            applyHideBreadcrumbConfig(this, config).catch(() => { }),
            applyMoreAnimationsConfig(this, config).catch(() => { }),
            applySingleColumnSlashMenuConfig(this, config).catch(() => { }),
            applyCardSearchListConfig(this, config).catch(() => { }),
            applyWindowTransparencyValueConfig(this, config).catch(() => { }),
            applyWholeWindowTransparencyConfig(this, config).catch(() => { }),
            applySmoothCaretConfig(this, config).catch(() => { }),
            applyFluidCursorConfig(this, config).catch(() => { }),
            applyIslandLayoutConfig(this, config).catch(() => { }),
            applyPaperConfig(this, config).catch(() => { }),
            applyNoiseConfig(this, config).catch(() => { }),
            applyAcrylicConfig(this, config).catch(() => { }),
            applyCheckerboardConfig(this, config).catch(() => { }),
            applyGridConfig(this, config).catch(() => { }),
            applyPolkaDotConfig(this, config).catch(() => { }),
            applyCrossDotConfig(this, config).catch(() => { }),
            applyHoneycombConfig(this, config).catch(() => { }),
            applyWoodConfig(this, config).catch(() => { }),
            applyCamouflageConfig(this, config).catch(() => { }),
            applyFiberConfig(this, config).catch(() => { }),
            applyFabricConfig(this, config).catch(() => { }),
            applyFollowTimeConfig(this, config).catch(() => { }),
        ]);
    }
    async onload() {
        this.unsubscribeBarModeClick = listenBarModeClick(this, () => { });
        this.unsubscribeTopbarFusionPlus = addMoreAfterTopbarFusionPlus(this);
        this.asriConfigClickHandler = (event: MouseEvent) => {
            queueMicrotask(() => {
                const target = event.target as HTMLElement;
                if (!target)
                    return;
                if (target.closest("#asri-enhance-amber") ||
                    target.closest("#asri-enhance-sakura") ||
                    target.closest("#asri-enhance-wilderness") ||
                    target.closest("#asri-enhance-midnight") ||
                    target.closest("#asri-enhance-salt") ||
                    target.closest("#asri-enhance-rosepine") ||
                    target.closest("#asri-enhance-topaz") ||
                    target.closest("#asri-enhance-oxygen") ||
                    target.closest("#asri-enhance-shade") ||
                    target.closest("#asri-enhance-gruvbox") ||
                    target.closest("#asri-enhance-glitch") ||
                    target.closest("#asri-enhance-nostalgia")) {
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
                                        const currentPalette = htmlEl.getAttribute("data-asri-palette");
                                        if (currentPalette !== paletteName) {
                                            htmlEl.setAttribute("data-asri-palette", paletteName);
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
        initSlashNavi();
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
        if (this.unsubscribeTopbarFusionPlus) {
            this.unsubscribeTopbarFusionPlus();
            this.unsubscribeTopbarFusionPlus = null;
        }
        if (this.asriConfigClickHandler) {
            document.removeEventListener("click", this.asriConfigClickHandler, true);
            this.asriConfigClickHandler = null;
        }
        if (this.themeModeObserver) {
            this.themeModeObserver.disconnect();
            this.themeModeObserver = null;
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
        destroySlashNavi();
        stopVerticalTabObserver();
        removeAllSidememoArtifacts();
        stopSidememoObserver();
        destroySmoothCaret();
        destroyFluidCursor();
        restoreMacTrafficLights();
        const htmlEl = document.documentElement;
        if (htmlEl) {
            const attrs = Array.from(htmlEl.attributes);
            attrs.forEach(attr => {
                if (attr.name.startsWith("data-asri-enhance-")) {
                    htmlEl.removeAttribute(attr.name);
                }
            });
        }
    }
    async uninstall() {
        this.onunload();
        await clearAllPluginConfig(this, "config.json").catch(() => {
        });
    }
}
export = AsriEnhancePlugin;
