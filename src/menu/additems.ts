import { Plugin } from "siyuan";
import { onAmberClick } from "../palette/amber";
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
							button.innerHTML = `
								<svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
									<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
										<path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path>
										<path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path>
										<path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path>
									</g>
								</svg>
								<span class="b3-menu__label">${plugin.i18n?.morePresetColors || "morePresetColors"}</span>
								<svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg>
								<div class="b3-menu__submenu">
									<div class="b3-menu__items">
										<button class="b3-menu__item" id="asri-enhance-amber">
											<svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
												<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
													<path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path>
													<path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path>
													<path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path>
												</g>
											</svg>
											<span class="b3-menu__label">${plugin.i18n?.amber || "amber"}</span>
										</button>
									</div>
								</div>
							`;
							parent.insertBefore(button, pickColor);
						}
						const amberItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-amber");
						if (amberItem) {
							amberItem.onclick = (event) => onAmberClick(plugin, event);
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
