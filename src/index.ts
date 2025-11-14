import { Plugin } from "siyuan";
import { listenBarModeClick, addMoreAfterTopbarFusionPlus, type Unsubscribe } from "./menu/additems";
import { applyAmberConfig } from "./palette/amber";
import { applyWildernessConfig } from "./palette/wilderness";
import { applyMidnightConfig } from "./palette/midnight";
import { applySaltConfig } from "./palette/salt";
import { applyRosepineConfig } from "./palette/rosepine";
import { applyTopazConfig } from "./palette/topaz";
import { applyOxygenConfig } from "./palette/oxygen";
import { applyShadeConfig } from "./palette/shade";
import { applyColoredHeadingConfig } from "./more/coloredheading";
import { applyColoredOutlineConfig } from "./more/coloredoutline";
import { applyTypewriterConfig, removeFocusEditing } from "./more/typewriter";
import { applyListBulletLineConfig, removeListBulletLineEffect } from "./more/listbulletline";
import { removePaletteConfig, clearAllPluginConfig, PALETTE_NAMES } from "./utils/storage";
import { initSlashNavi, destroySlashNavi } from "./module/slashnavi";
class AsriEnhancePlugin extends Plugin {
	private unsubscribeBarModeClick: Unsubscribe | null = null;
	private unsubscribeTopbarFusionPlus: Unsubscribe | null = null;
	private asriConfigClickHandler: ((event: MouseEvent) => void) | null = null;
	private themeModeObserver: MutationObserver | null = null;
	async onload() {
		this.unsubscribeBarModeClick = listenBarModeClick(this, () => {});
		this.unsubscribeTopbarFusionPlus = addMoreAfterTopbarFusionPlus(this);
		this.asriConfigClickHandler = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target) return;
			if (
				target.closest("#asri-enhance-amber") ||
				target.closest("#asri-enhance-wilderness") ||
				target.closest("#asri-enhance-midnight") ||
				target.closest("#asri-enhance-salt") ||
				target.closest("#asri-enhance-rosepine") ||
				target.closest("#asri-enhance-topaz") ||
				target.closest("#asri-enhance-oxygen") ||
				target.closest("#asri-enhance-shade")
			) {
				return;
			}
			const asriConfig = target.closest(".asri-config");
			if (asriConfig && asriConfig.id !== "topbarFusionPlus") {
				PALETTE_NAMES.forEach((palette) => {
					removePaletteConfig(this, palette, "config.json").catch(() => {
					});
				});
			}
		};
		document.addEventListener("click", this.asriConfigClickHandler, true);
		const htmlEl = document.documentElement;
		if (htmlEl) {
			this.themeModeObserver = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (mutation.type === "attributes" && mutation.attributeName === "data-theme-mode") {
						applyAmberConfig(this).catch(() => {
						});
						applyWildernessConfig(this).catch(() => {
						});
						applyMidnightConfig(this).catch(() => {
						});
						applySaltConfig(this).catch(() => {
						});
						applyRosepineConfig(this).catch(() => {
						});
						applyTopazConfig(this).catch(() => {
						});
						applyOxygenConfig(this).catch(() => {
						});
						applyShadeConfig(this).catch(() => {
						});
					}
				}
			});
			this.themeModeObserver.observe(htmlEl, {
				attributes: true,
				attributeFilter: ["data-theme-mode"],
			});
		}
		applyAmberConfig(this).catch(() => {
		});
		applyWildernessConfig(this).catch(() => {
		});
		applyMidnightConfig(this).catch(() => {
		});
		applySaltConfig(this).catch(() => {
		});
		applyRosepineConfig(this).catch(() => {
		});
		applyTopazConfig(this).catch(() => {
		});
		applyOxygenConfig(this).catch(() => {
		});
		applyShadeConfig(this).catch(() => {
		});
		applyColoredHeadingConfig(this).catch(() => {
		});
		applyColoredOutlineConfig(this).catch(() => {
		});
		applyTypewriterConfig(this).catch(() => {
		});
		applyListBulletLineConfig(this).catch(() => {
		});
		initSlashNavi();
		setTimeout(() => {
			applyAmberConfig(this).catch(() => {
			});
			applyWildernessConfig(this).catch(() => {
			});
			applyMidnightConfig(this).catch(() => {
			});
			applySaltConfig(this).catch(() => {
			});
			applyRosepineConfig(this).catch(() => {
			});
			applyTopazConfig(this).catch(() => {
			});
			applyOxygenConfig(this).catch(() => {
			});
			applyShadeConfig(this).catch(() => {
			});
			applyColoredHeadingConfig(this).catch(() => {
			});
			applyColoredOutlineConfig(this).catch(() => {
			});
			applyTypewriterConfig(this).catch(() => {
			});
			applyListBulletLineConfig(this).catch(() => {
			});
		}, 500);
		setTimeout(() => {
			applyAmberConfig(this).catch(() => {
			});
			applyWildernessConfig(this).catch(() => {
			});
			applyMidnightConfig(this).catch(() => {
			});
			applySaltConfig(this).catch(() => {
			});
			applyRosepineConfig(this).catch(() => {
			});
			applyTopazConfig(this).catch(() => {
			});
			applyOxygenConfig(this).catch(() => {
			});
			applyShadeConfig(this).catch(() => {
			});
			applyColoredHeadingConfig(this).catch(() => {
			});
			applyColoredOutlineConfig(this).catch(() => {
			});
			applyTypewriterConfig(this).catch(() => {
			});
			applyListBulletLineConfig(this).catch(() => {
			});
		}, 1500);
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
		removeListBulletLineEffect();
		removeFocusEditing();
		destroySlashNavi();
	}
	async uninstall() {
		this.onunload();
		await clearAllPluginConfig(this, "config.json").catch(() => {
		});
	}
}
export = AsriEnhancePlugin;
