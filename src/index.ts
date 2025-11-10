import { Plugin } from "siyuan";
import { listenBarModeClick, type Unsubscribe } from "./menu/additems";
import { applyAmberConfig } from "./palette/amber";
import { removeAmberConfig, clearAllPluginConfig } from "./utils/storage";
class AsriEnhancePlugin extends Plugin {
	private unsubscribeBarModeClick: Unsubscribe | null = null;
	private asriConfigClickHandler: ((event: MouseEvent) => void) | null = null;
	private themeModeObserver: MutationObserver | null = null;
	async onload() {
		this.unsubscribeBarModeClick = listenBarModeClick(this, () => {});
		this.asriConfigClickHandler = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target) return;
			if (target.closest("#asri-enhance-amber")) {
				return;
			}
			const asriConfig = target.closest(".asri-config");
			if (asriConfig && asriConfig.id !== "topbarFusionPlus") {
				removeAmberConfig(this, "config.json").catch(() => {
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
					}
				}
			});
			this.themeModeObserver.observe(htmlEl, {
				attributes: true,
				attributeFilter: ["data-theme-mode"],
			});
		}
		setTimeout(() => {
			applyAmberConfig(this).catch(() => {
			});
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
	}
	async uninstall() {
		this.onunload();
		await clearAllPluginConfig(this, "config.json").catch(() => {
		});
	}
}
export = AsriEnhancePlugin;
