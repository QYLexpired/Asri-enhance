import { Plugin } from "siyuan";
import { onAmberClick } from "../palette/amber";
import { onWildernessClick } from "../palette/wilderness";
import { onMidnightClick } from "../palette/midnight";
import { onColoredHeadingClick } from "../more/coloredheading";
import { onColoredOutlineClick } from "../more/coloredoutline";
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
							button.innerHTML = `<svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.morePresetColors || "morePresetColors"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"><button class="b3-menu__item" id="asri-enhance-amber"><svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.amber || "amber"}</span></button><button class="b3-menu__item" id="asri-enhance-wilderness"><svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.wilderness || "wilderness"}</span></button><button class="b3-menu__item" id="asri-enhance-midnight"><svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg><span class="b3-menu__label">${plugin.i18n?.midnight || "midnight"}</span></button></div></div>`;
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
							button.innerHTML = `<svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg><span class="b3-menu__label">${plugin.i18n?.more || "more"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"><button class="b3-menu__item" id="asri-enhance-colored-heading"><svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg><span class="b3-menu__label">${plugin.i18n?.coloredHeading || "coloredHeading"}</span></button><button class="b3-menu__item" id="asri-enhance-colored-outline"><svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg><span class="b3-menu__label">${plugin.i18n?.coloredOutline || "coloredOutline"}</span></button></div></div>`;
							if (topbarFusionPlus.nextSibling) {
								parent.insertBefore(button, topbarFusionPlus.nextSibling);
							} else {
								parent.appendChild(button);
							}
						}
						const coloredHeadingItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-colored-heading");
						if (coloredHeadingItem) {
							coloredHeadingItem.onclick = (event) => onColoredHeadingClick(plugin, event);
						}
						const coloredOutlineItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-colored-outline");
						if (coloredOutlineItem) {
							coloredOutlineItem.onclick = (event) => onColoredOutlineClick(plugin, event);
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
