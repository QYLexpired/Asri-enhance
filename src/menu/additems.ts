import { Plugin } from "siyuan";
import { onAmberClick } from "../palette/amber";
import { onWildernessClick } from "../palette/wilderness";
import { onMidnightClick } from "../palette/midnight";
import { onSaltClick } from "../palette/salt";
import { onRosepineClick } from "../palette/rosepine";
import { onTopazClick } from "../palette/topaz";
import { onOxygenClick } from "../palette/oxygen";
import { onShadeClick } from "../palette/shade";
import { onGruvboxClick } from "../palette/gruvbox";
import { onColoredHeadingClick } from "../detail/coloredheading";
import { onColoredTreeClick } from "../detail/coloredtree";
import { onTypewriterClick } from "../more/typewriter";
import { onListBulletLineClick } from "../more/listbulletline";
import { onSidebarTopStickyClick } from "../detail/sidebartopsticky";
import { onCoverImageFadeClick } from "../detail/coverimagefade";
import { onHideTabBreadcrumbClick } from "../detail/hidetabandbreadcrumb";
export type Unsubscribe = () => void;
export function listenBarModeClick(
	plugin: Plugin,
	callback: (event: MouseEvent) => void,
	delayMs: number = 100,
): Unsubscribe {
	let timeoutId: number | undefined;
	let pollTimerId: number | undefined;
	let boundTarget: HTMLElement | null = null;
	let attempts = 0;
	const activePickColorPolls = new Set<number>();
	const maxAttempts = 10;
	const searchIntervalMs = 100;
	const clearPickColorPolls = () => {
		activePickColorPolls.forEach((id) => window.clearTimeout(id));
		activePickColorPolls.clear();
	};
	const schedulePickColorPoll = (fn: () => void, delay: number) => {
		const id = window.setTimeout(() => {
			activePickColorPolls.delete(id);
			fn();
		}, delay);
		activePickColorPolls.add(id);
		return id;
	};
	const handleClick = (event: MouseEvent) => {
		if (timeoutId !== undefined) {
			window.clearTimeout(timeoutId);
		}
		timeoutId = window.setTimeout(() => {
			clearPickColorPolls();
			const findPickColor = (searchAttempt: number = 0) => {
				const pickColor = document.querySelector<HTMLElement>(
					'#commonMenu[data-name="barmode"] #pickColor',
				);
				if (pickColor) {
					const parent = pickColor.parentElement;
					if (parent) {
						if (!parent.querySelector("#asri-enhance-palette")) {
							const button = document.createElement("button");
							button.className = "b3-menu__item asri-enhance";
							button.id = "asri-enhance-palette";
							button.innerHTML = `<svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.morePresetColors || "morePresetColors"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"><button class="b3-menu__item" id="asri-enhance-amber"><svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.amber || "amber"}</span></button><button class="b3-menu__item" id="asri-enhance-wilderness"><svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.wilderness || "wilderness"}</span></button><button class="b3-menu__item" id="asri-enhance-midnight"><svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4 v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.midnight || "midnight"}</span></button><button class="b3-menu__item" id="asri-enhance-salt"><svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.salt || "salt"}</span></button><button class="b3-menu__item" id="asri-enhance-rosepine"><svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.rosePine || "Rosé Pine"}</span></button><button class="b3-menu__item" id="asri-enhance-topaz"><svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.goldenTopaz || "Golden Topaz"}</span></button><button class="b3-menu__item" id="asri-enhance-oxygen"><svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.oxygen || "Oxygen"}</span></button><button class="b3-menu__item" id="asri-enhance-shade"><svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.shade || "Shade"}</span></button><button class="b3-menu__item" id="asri-enhance-gruvbox"><svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.gruvbox || "Gruvbox"}</span></button></div></div>`;
							parent.insertBefore(button, pickColor);
						}
						const amberItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-amber");
						if (amberItem) {
							amberItem.onclick = (event) => onAmberClick(plugin, event);
						}
						const wildernessItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-wilderness");
						if (wildernessItem) {
							wildernessItem.onclick = (event) => onWildernessClick(plugin, event);
						}
						const midnightItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-midnight");
						if (midnightItem) {
							midnightItem.onclick = (event) => onMidnightClick(plugin, event);
						}
						const saltItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-salt");
						if (saltItem) {
							saltItem.onclick = (event) => onSaltClick(plugin, event);
						}
						const rosepineItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-rosepine");
						if (rosepineItem) {
							rosepineItem.onclick = (event) => onRosepineClick(plugin, event);
						}
						const topazItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-topaz");
						if (topazItem) {
							topazItem.onclick = (event) => onTopazClick(plugin, event);
						}
						const oxygenItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-oxygen");
						if (oxygenItem) {
							oxygenItem.onclick = (event) => onOxygenClick(plugin, event);
						}
						const shadeItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-shade");
						if (shadeItem) {
							shadeItem.onclick = (event) => onShadeClick(plugin, event);
						}
						const gruvboxItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-gruvbox");
						if (gruvboxItem) {
							gruvboxItem.onclick = (event) => onGruvboxClick(plugin, event);
						}
					}
					callback(event);
					return;
				}
				if (searchAttempt + 1 < maxAttempts) {
					schedulePickColorPoll(() => findPickColor(searchAttempt + 1), searchIntervalMs);
				} else {
					callback(event);
				}
			};
			findPickColor();
			timeoutId = undefined;
		}, delayMs);
	};
	const bindListener = () => {
		const target = document.querySelector<HTMLElement>("#barMode");
		if (target) {
			boundTarget = target;
			target.addEventListener("click", handleClick, true);
			pollTimerId = undefined;
			return;
		}
		attempts += 1;
		if (attempts < maxAttempts) {
			pollTimerId = window.setTimeout(bindListener, searchIntervalMs);
		} else {
			pollTimerId = undefined;
		}
	};
	bindListener();
	return () => {
		if (pollTimerId !== undefined) {
			window.clearTimeout(pollTimerId);
			pollTimerId = undefined;
		}
		clearPickColorPolls();
		if (boundTarget) {
			boundTarget.removeEventListener("click", handleClick, true);
			boundTarget = null;
		}
		if (timeoutId !== undefined) {
			window.clearTimeout(timeoutId);
			timeoutId = undefined;
		}
	};
}
export function addMoreAfterTopbarFusionPlus(
	plugin: Plugin,
	delayMs: number = 100,
): Unsubscribe {
	let timeoutId: number | undefined;
	let pollTimerId: number | undefined;
	let boundTarget: HTMLElement | null = null;
	let attempts = 0;
	const activeTopbarFusionPlusPolls = new Set<number>();
	const maxAttempts = 10;
	const searchIntervalMs = 100;
	const clearTopbarFusionPlusPolls = () => {
		activeTopbarFusionPlusPolls.forEach((id) => window.clearTimeout(id));
		activeTopbarFusionPlusPolls.clear();
	};
	const scheduleTopbarFusionPlusPoll = (fn: () => void, delay: number) => {
		const id = window.setTimeout(() => {
			activeTopbarFusionPlusPolls.delete(id);
			fn();
		}, delay);
		activeTopbarFusionPlusPolls.add(id);
		return id;
	};
	const handleClick = (event: MouseEvent) => {
		if (timeoutId !== undefined) {
			window.clearTimeout(timeoutId);
		}
		timeoutId = window.setTimeout(() => {
			clearTopbarFusionPlusPolls();
			const findTopbarFusionPlus = (searchAttempt: number = 0) => {
				const topbarFusionPlus = document.querySelector<HTMLElement>(
					'#commonMenu[data-name="barmode"] #topbarFusionPlus',
				);
				if (topbarFusionPlus) {
					const parent = topbarFusionPlus.parentElement;
					if (parent) {
						if (!parent.querySelector("#asri-enhance-more")) {
							const button = document.createElement("button");
							button.className = "b3-menu__item asri-enhance";
							button.id = "asri-enhance-more";
							button.innerHTML = `<svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg><span class="b3-menu__label">${plugin.i18n?.more || "more"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"><button class="b3-menu__item" id="asri-enhance-detail-adjustment"><svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg><span class="b3-menu__label">${plugin.i18n?.detailAdjustment || "detailAdjustment"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"></div></div></button><button class="b3-menu__item" id="asri-enhance-typewriter"><svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg><span class="b3-menu__label">${plugin.i18n?.typewriterMode || "typewriterMode"}</span></button><button class="b3-menu__item" id="asri-enhance-list-bullet-line"><svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg><span class="b3-menu__label">${plugin.i18n?.listBulletLine || "listBulletLine"}</span></button></div></div>`;
							if (topbarFusionPlus.nextSibling) {
								parent.insertBefore(button, topbarFusionPlus.nextSibling);
							} else {
								parent.appendChild(button);
							}
						}
						const typewriterItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-typewriter");
						if (typewriterItem) {
							typewriterItem.onclick = (event) => onTypewriterClick(plugin, event);
						}
						const listBulletLineItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-list-bullet-line");
						if (listBulletLineItem) {
							listBulletLineItem.onclick = (event) => onListBulletLineClick(plugin, event);
						}
						const detailAdjustmentItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-detail-adjustment");
						if (detailAdjustmentItem) {
							const detailAdjustmentSubmenu = detailAdjustmentItem.querySelector<HTMLElement>(".b3-menu__submenu .b3-menu__items");
							if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-sidebar-top-sticky")) {
								const sidebarTopStickyIcon = `<svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg>`;
								const sidebarTopStickyButton = document.createElement("button");
								sidebarTopStickyButton.className = "b3-menu__item";
								sidebarTopStickyButton.id = "asri-enhance-sidebar-top-sticky";
								sidebarTopStickyButton.innerHTML = `${sidebarTopStickyIcon}<span class="b3-menu__label">${plugin.i18n?.sidebarTopSticky || "sidebarTopSticky"}</span>`;
								detailAdjustmentSubmenu.appendChild(sidebarTopStickyButton);
							}
							const sidebarTopStickyItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-sidebar-top-sticky");
							if (sidebarTopStickyItem) {
								sidebarTopStickyItem.onclick = (event) => onSidebarTopStickyClick(plugin, event);
							}
							if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-cover-image-fade")) {
								const coverImageFadeIcon = `<svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg>`;
								const coverImageFadeButton = document.createElement("button");
								coverImageFadeButton.className = "b3-menu__item";
								coverImageFadeButton.id = "asri-enhance-cover-image-fade";
								coverImageFadeButton.innerHTML = `${coverImageFadeIcon}<span class="b3-menu__label">${plugin.i18n?.coverImageFade || "coverImageFade"}</span>`;
								detailAdjustmentSubmenu.appendChild(coverImageFadeButton);
							}
							const coverImageFadeItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-cover-image-fade");
							if (coverImageFadeItem) {
								coverImageFadeItem.onclick = (event) => onCoverImageFadeClick(plugin, event);
							}
							if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-heading")) {
								const coloredHeadingIcon = `<svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg>`;
								const coloredHeadingButton = document.createElement("button");
								coloredHeadingButton.className = "b3-menu__item";
								coloredHeadingButton.id = "asri-enhance-colored-heading";
								coloredHeadingButton.innerHTML = `${coloredHeadingIcon}<span class="b3-menu__label">${plugin.i18n?.coloredHeading || "coloredHeading"}</span>`;
								detailAdjustmentSubmenu.appendChild(coloredHeadingButton);
							}
							const coloredHeadingItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-colored-heading");
							if (coloredHeadingItem) {
								coloredHeadingItem.onclick = (event) => onColoredHeadingClick(plugin, event);
							}
							if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-tree")) {
								const coloredTreeIcon = `<svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg>`;
								const coloredTreeButton = document.createElement("button");
								coloredTreeButton.className = "b3-menu__item";
								coloredTreeButton.id = "asri-enhance-colored-tree";
								coloredTreeButton.innerHTML = `${coloredTreeIcon}<span class="b3-menu__label">${plugin.i18n?.coloredTree || "coloredTree"}</span>`;
								detailAdjustmentSubmenu.appendChild(coloredTreeButton);
							}
							const coloredTreeItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-colored-tree");
							if (coloredTreeItem) {
								coloredTreeItem.onclick = (event) => onColoredTreeClick(plugin, event);
							}
							if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-hide-tab-breadcrumb")) {
								const hideTabBreadcrumbIcon = `<svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg>`;
								const hideTabBreadcrumbButton = document.createElement("button");
								hideTabBreadcrumbButton.className = "b3-menu__item";
								hideTabBreadcrumbButton.id = "asri-enhance-hide-tab-breadcrumb";
								hideTabBreadcrumbButton.innerHTML = `${hideTabBreadcrumbIcon}<span class="b3-menu__label">${plugin.i18n?.hideTabBreadcrumb || "hideTabBreadcrumb"}</span>`;
								detailAdjustmentSubmenu.appendChild(hideTabBreadcrumbButton);
							}
							const hideTabBreadcrumbItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-hide-tab-breadcrumb");
							if (hideTabBreadcrumbItem) {
								hideTabBreadcrumbItem.onclick = (event) => onHideTabBreadcrumbClick(plugin, event);
							}
						}
					}
					return;
				}
				if (searchAttempt + 1 < maxAttempts) {
					scheduleTopbarFusionPlusPoll(() => findTopbarFusionPlus(searchAttempt + 1), searchIntervalMs);
				}
			};
			findTopbarFusionPlus();
			timeoutId = undefined;
		}, delayMs);
	};
	const bindListener = () => {
		const target = document.querySelector<HTMLElement>("#barMode");
		if (target) {
			boundTarget = target;
			target.addEventListener("click", handleClick, true);
			pollTimerId = undefined;
			return;
		}
		attempts += 1;
		if (attempts < maxAttempts) {
			pollTimerId = window.setTimeout(bindListener, searchIntervalMs);
		} else {
			pollTimerId = undefined;
		}
	};
	bindListener();
	return () => {
		if (pollTimerId !== undefined) {
			window.clearTimeout(pollTimerId);
			pollTimerId = undefined;
		}
		clearTopbarFusionPlusPolls();
		if (boundTarget) {
			boundTarget.removeEventListener("click", handleClick, true);
			boundTarget = null;
		}
		if (timeoutId !== undefined) {
			window.clearTimeout(timeoutId);
			timeoutId = undefined;
		}
	};
}
