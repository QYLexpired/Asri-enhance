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
import { applyColoredHeadingConfig } from "./detail/coloredheading";
import { applyColoredTreeConfig } from "./detail/coloredtree";
import { applyHeadingLevelHintConfig } from "./detail/headinglevelhint";
import { applyListBulletLineConfig, removeListBulletLineEffect } from "./more/listbulletline";
import { applyVerticalTabConfig, stopObserver as stopVerticalTabObserver } from "./more/verticaltab";
import { applySidememoConfig, stopObserver as stopSidememoObserver, removeAllSidememoArtifacts } from "./more/sidememo";
import { applySidebarTopStickyConfig } from "./detail/sidebartopsticky";
import { applyCoverImageFadeConfig } from "./detail/coverimagefade";
import { applyPaperTextureConfig } from "./detail/papertexture";
import { applyHideTabBreadcrumbConfig } from "./detail/hidetabandbreadcrumb";
import { applyMoreAnimationsConfig } from "./detail/moreanimations";
import { applySingleColumnSlashMenuConfig } from "./detail/singlecolumnslashmenu";
import { applyDisableWindowTransparencyConfig } from "./detail/disablewindowtransparency";
import { removePaletteConfig, clearAllPluginConfig, PALETTE_NAMES, loadData, disableAllPalettesForCurrentTheme } from "./utils/storage";
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
            applyColoredHeadingConfig(this, config).catch(() => { }),
            applyColoredTreeConfig(this, config).catch(() => { }),
            applyHeadingLevelHintConfig(this, config).catch(() => { }),
            applyListBulletLineConfig(this, config).catch(() => { }),
            applyVerticalTabConfig(this, config).catch(() => { }),
            applySidememoConfig(this, config).catch(() => { }),
            applySidebarTopStickyConfig(this, config).catch(() => { }),
            applyCoverImageFadeConfig(this, config).catch(() => { }),
            applyHideTabBreadcrumbConfig(this, config).catch(() => { }),
            applyPaperTextureConfig(this, config).catch(() => { }),
            applyMoreAnimationsConfig(this, config).catch(() => { }),
            applySingleColumnSlashMenuConfig(this, config).catch(() => { }),
            applyDisableWindowTransparencyConfig(this, config).catch(() => { }),
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
                    target.closest("#asri-enhance-glitch")) {
                    return;
                }
                const asriConfig = target.closest(".asri-config");
                if (asriConfig && asriConfig.id !== "topbarFusionPlus") {
                    PALETTE_NAMES.forEach((palette) => {
                        removePaletteConfig(this, palette, "config.json").catch(() => {
                        });
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
                    this.paletteDisableDebounceTimer = window.setTimeout(() => {
                        disableAllPalettesForCurrentTheme(this, "config.json").then(() => {
                            loadData(this, "config.json").then((newConfig) => {
                                this.applyAllConfigs(newConfig).catch(() => { });
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
    }
    async uninstall() {
        this.onunload();
        await clearAllPluginConfig(this, "config.json").catch(() => {
        });
    }
}
export = AsriEnhancePlugin;
