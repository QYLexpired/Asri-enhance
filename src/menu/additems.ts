import { Plugin } from "siyuan";
import { onAmberClick } from "../palette/amber";
import { onSakuraClick } from "../palette/sakura";
import { onWildernessClick } from "../palette/wilderness";
import { onMidnightClick } from "../palette/midnight";
import { onSaltClick } from "../palette/salt";
import { onRosepineClick } from "../palette/rosepine";
import { onTopazClick } from "../palette/topaz";
import { onOxygenClick } from "../palette/oxygen";
import { onShadeClick } from "../palette/shade";
import { onGruvboxClick } from "../palette/gruvbox";
import { onGlitchClick } from "../palette/glitch";
import { onNostalgiaClick } from "../palette/nostalgia";
import { onColoredHeadingClick } from "../detail/coloredheading";
import { onHeadingLevelHintClick } from "../detail/headinglevelhint";
import { onColoredTreeClick } from "../detail/coloredtree";
import { onColoredListClick } from "../detail/coloredlist";
import { onListBulletLineClick } from "../more/listbulletline";
import { onVerticalTabClick } from "../more/verticaltab";
import { onSideMemoClick } from "../more/sidememo";
import { onGlobalFrostedGlassClick } from "../detail/globalfrostedglass";
import { onSidebarTopStickyClick } from "../detail/sidebartopsticky";
import { onHideTabClick } from "../detail/hidetab";
import { onHideBreadcrumbClick } from "../detail/hidebreadcrumb";
import { onMoreAnimationsClick } from "../detail/moreanimations";
import { onSingleColumnSlashMenuClick } from "../detail/singlecolumnslashmenu";
import { onCardSearchListClick } from "../detail/cardsearchlist";
import { onWindowTransparencyValueClick, saveWindowTransparencyValue } from "../detail/windowtransparencyvalue";
import { onWholeWindowTransparencyClick } from "../detail/wholewindowtransparency";
import { onSmoothCaretClick } from "../more/smoothcaret";
import { onFluidCursorClick } from "../more/fluidcursor";
import { onIslandLayoutClick } from "../more/islandlayout";
import { onPaperClick } from "../texture/paper";
import { onNoiseClick } from "../texture/noise";
import { onAcrylicClick } from "../texture/acrylic";
import { onCheckerboardClick } from "../texture/checkerboard";
import { onGridClick } from "../texture/grid";
import { onPolkaDotClick } from "../texture/polkadot";
import { onCrossDotClick } from "../texture/crossdot";
import { onHoneycombClick } from "../texture/honeycomb";
import { onWoodClick } from "../texture/wood";
import { onCamouflageClick } from "../texture/camouflage";
import { onFiberClick } from "../texture/fiber";
import { onFabricClick } from "../texture/fabric";
import { onTypewriterModeClick } from "../immersive/typewriter";
import { onFocusModeClick } from "../immersive/focus";
import { loadData } from "../utils/storage";
import { onFollowTimeClick, saveFollowTimeColor } from "../followtime/followtime";
const PALETTE_ICON_SVG = '<svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg>';
const MORE_ICON_SVG = '<svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg>';
export type Unsubscribe = () => void;
interface ListenerState {
    timeoutId?: number;
    pollTimerId?: number;
    boundTarget?: HTMLElement | null;
    attempts: number;
    activePolls: Set<number>;
}
const MAX_ATTEMPTS = 10;
const SEARCH_INTERVAL_MS = 100;
function clearPolls(state: ListenerState) {
    state.activePolls.forEach((id) => window.clearTimeout(id));
    state.activePolls.clear();
}
function schedulePoll(state: ListenerState, fn: () => void, delay: number) {
    const id = window.setTimeout(() => {
        state.activePolls.delete(id);
        fn();
    }, delay);
    state.activePolls.add(id);
    return id;
}
function cleanup(state: ListenerState) {
    if (state.pollTimerId !== undefined) {
        window.clearTimeout(state.pollTimerId);
        state.pollTimerId = undefined;
    }
    clearPolls(state);
    if (state.boundTarget) {
        state.boundTarget = null;
    }
    if (state.timeoutId !== undefined) {
        window.clearTimeout(state.timeoutId);
        state.timeoutId = undefined;
    }
}
export function listenBarModeClick(plugin: Plugin, onClick: (event: MouseEvent) => void): Unsubscribe {
    const state: ListenerState = {
        timeoutId: undefined,
        pollTimerId: undefined,
        boundTarget: null,
        attempts: 0,
        activePolls: new Set(),
    };
    const handleClick = (event: MouseEvent) => {
        if (state.timeoutId !== undefined) {
            window.clearTimeout(state.timeoutId);
        }
        state.timeoutId = window.setTimeout(() => {
            clearPolls(state);
            onClick(event);
            state.timeoutId = undefined;
        }, 0);
    };
    const bindListener = () => {
        const target = document.querySelector<HTMLElement>("#barMode");
        if (target) {
            state.boundTarget = target;
            target.addEventListener("click", handleClick, true);
            state.pollTimerId = undefined;
            return;
        }
        state.attempts += 1;
        if (state.attempts < MAX_ATTEMPTS) {
            state.pollTimerId = window.setTimeout(bindListener, SEARCH_INTERVAL_MS);
        } else {
            state.pollTimerId = undefined;
        }
    };
    bindListener();
    return () => {
        cleanup(state);
        if (state.boundTarget) {
            state.boundTarget.removeEventListener("click", handleClick, true);
            state.boundTarget = null;
        }
    };
}
export function addAsriEnhanceItems(plugin: Plugin, event: MouseEvent): void {
    const menu = document.querySelector<HTMLElement>('#commonMenu[data-name="barmode"]');
    if (!menu) return;
    const pollState: ListenerState = {
        activePolls: new Set(),
        attempts: 0,
    };
    const findAndInjectItems = (searchAttempt: number = 0) => {
        const pickColor = menu.querySelector<HTMLElement>("#pickColor");
        const topbarFusionPlus = menu.querySelector<HTMLElement>("#topbarFusionPlus");
        if (!pickColor || !topbarFusionPlus) {
            if (searchAttempt + 1 < MAX_ATTEMPTS) {
                schedulePoll(pollState, () => findAndInjectItems(searchAttempt + 1), SEARCH_INTERVAL_MS);
            }
            return;
        }
        injectPaletteMenu(plugin, pickColor);
        injectMoreMenu(plugin, topbarFusionPlus);
    };
    findAndInjectItems();
}
function injectPaletteMenu(plugin: Plugin, pickColor: HTMLElement): void {
    const parent = pickColor.parentElement;
    if (!parent) return;
    if (!parent.querySelector("#asri-enhance-palette")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item asri-enhance";
        button.id = "asri-enhance-palette";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.morePresetColors || "morePresetColors"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"><button class="b3-menu__item" id="asri-enhance-sakura">${PALETTE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.sakura || "Sakura"}</span></button><button class="b3-menu__item" id="asri-enhance-amber">${PALETTE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.amber || "amber"}</span></button><button class="b3-menu__item" id="asri-enhance-wilderness">${PALETTE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.wilderness || "wilderness"}</span></button><button class="b3-menu__item" id="asri-enhance-midnight">${PALETTE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.midnight || "midnight"}</span></button><button class="b3-menu__item" id="asri-enhance-salt">${PALETTE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.salt || "salt"}</span></button><button class="b3-menu__item" id="asri-enhance-rosepine">${PALETTE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.rosePine || "Rosé Pine"}</span></button><button class="b3-menu__item" id="asri-enhance-topaz">${PALETTE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.goldenTopaz || "Golden Topaz"}</span></button><button class="b3-menu__item" id="asri-enhance-oxygen">${PALETTE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.oxygen || "Oxygen"}</span></button><button class="b3-menu__item" id="asri-enhance-shade">${PALETTE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.shade || "Shade"}</span></button><button class="b3-menu__item" id="asri-enhance-gruvbox">${PALETTE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.gruvbox || "Gruvbox"}</span></button><button class="b3-menu__item" id="asri-enhance-glitch">${PALETTE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.glitch || "glitch"}</span></button><button class="b3-menu__item" id="asri-enhance-nostalgia">${PALETTE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.nostalgia || "回忆"}</span></button></div></div>`;
        let insertBeforeElement = pickColor;
        let previousElement = pickColor.previousElementSibling;
        while (previousElement) {
            if (previousElement.classList && previousElement.classList.contains('b3-menu__separator')) {
                insertBeforeElement = previousElement as HTMLElement;
                break;
            }
            previousElement = previousElement.previousElementSibling;
        }
        parent.insertBefore(button, insertBeforeElement);
    }
    const paletteItems = [
        { id: "asri-enhance-sakura", handler: onSakuraClick },
        { id: "asri-enhance-amber", handler: onAmberClick },
        { id: "asri-enhance-wilderness", handler: onWildernessClick },
        { id: "asri-enhance-midnight", handler: onMidnightClick },
        { id: "asri-enhance-salt", handler: onSaltClick },
        { id: "asri-enhance-rosepine", handler: onRosepineClick },
        { id: "asri-enhance-topaz", handler: onTopazClick },
        { id: "asri-enhance-oxygen", handler: onOxygenClick },
        { id: "asri-enhance-shade", handler: onShadeClick },
        { id: "asri-enhance-gruvbox", handler: onGruvboxClick },
        { id: "asri-enhance-glitch", handler: onGlitchClick },
        { id: "asri-enhance-nostalgia", handler: onNostalgiaClick },
    ];
    paletteItems.forEach(({ id, handler }) => {
        const item = parent.querySelector<HTMLButtonElement>(`#${id}`);
        if (item) {
            item.onclick = (e) => handler(plugin, e);
        }
    });
    const followCoverImgColor = document.querySelector<HTMLElement>('#commonMenu[data-name="barmode"] #followCoverImgColor');
    if (followCoverImgColor && !parent.querySelector("#asri-enhance-follow-time")) {
        const savedColor = document.documentElement.style.getPropertyValue("--asri-enhance-follow-time-base-color") || "#3478f6";
        const followTimeButton = document.createElement("button");
        followTimeButton.className = "b3-menu__item asri-enhance";
        followTimeButton.id = "asri-enhance-follow-time";
        followTimeButton.innerHTML = `<svg class="b3-menu__icon"></svg><input id="asri-enhance-followtime-colorpicker" type="color" value="${savedColor}"><span class="b3-menu__label">${plugin.i18n?.followTime || "Follow Time"}</span>`;
        if (followCoverImgColor.nextSibling) {
            parent.insertBefore(followTimeButton, followCoverImgColor.nextSibling);
        } else {
            parent.appendChild(followTimeButton);
        }
        const colorPicker = followTimeButton.querySelector<HTMLInputElement>("#asri-enhance-followtime-colorpicker");
        if (colorPicker) {
            followTimeButton.addEventListener("click", async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await onFollowTimeClick(plugin);
                colorPicker.click();
            });
            colorPicker.addEventListener("click", (e) => {
                e.stopPropagation();
            });
            colorPicker.addEventListener("input", async (e) => {
                const target = e.target as HTMLInputElement;
                await saveFollowTimeColor(plugin, target.value);
            });
        }
    }
}
function injectMoreMenu(plugin: Plugin, topbarFusionPlus: HTMLElement): void {
    const parent = topbarFusionPlus.parentElement;
    if (!parent) return;
    if (!parent.querySelector("#asri-enhance-more")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item asri-enhance";
        button.id = "asri-enhance-more";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.more || "more"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"><button class="b3-menu__item" id="asri-enhance-detail-adjustment">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.detailAdjustment || "detailAdjustment"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"></div></div></button><button class="b3-menu__item" id="asri-enhance-texture">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.texture || "texture"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"></div></div></button><button class="b3-menu__item" id="asri-enhance-immersive">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.immersive || "immersiveEdit"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"></div></div></button><button class="b3-menu__separator"></button><button class="b3-menu__item" id="asri-enhance-list-bullet-line">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.listBulletLine || "listBulletLine"}</span></button><button class="b3-menu__item" id="asri-enhance-vertical-tab">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.verticalTab || "verticalTab"}</span></button><button class="b3-menu__item" id="asri-enhance-sidememo">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.sidememo || "sidememo"}</span></button><button class="b3-menu__item" id="asri-enhance-smooth-caret">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.smoothCaret || "smoothCaret"}</span></button><button class="b3-menu__item" id="asri-enhance-fluid-cursor">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.fluidCursor || "fluidCursor"}</span></button><button class="b3-menu__item" id="asri-enhance-island-layout">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.islandLayout || "islandLayout"}</span></button></div></div>`;
        if (topbarFusionPlus.nextSibling) {
            parent.insertBefore(button, topbarFusionPlus.nextSibling);
        } else {
            parent.appendChild(button);
        }
    }
    const mainMenuItems = [
        { id: "asri-enhance-list-bullet-line", handler: onListBulletLineClick },
        { id: "asri-enhance-vertical-tab", handler: onVerticalTabClick },
        { id: "asri-enhance-sidememo", handler: onSideMemoClick },
        { id: "asri-enhance-smooth-caret", handler: onSmoothCaretClick },
        { id: "asri-enhance-fluid-cursor", handler: onFluidCursorClick },
        { id: "asri-enhance-island-layout", handler: onIslandLayoutClick },
    ];
    mainMenuItems.forEach(({ id, handler }) => {
        const item = parent.querySelector<HTMLButtonElement>(`#${id}`);
        if (item) {
            item.onclick = (e) => handler(plugin, e);
        }
    });
    injectDetailAdjustmentMenu(plugin, parent);
    injectTextureMenu(plugin, parent);
    injectImmersiveMenu(plugin, parent);
}
function injectDetailAdjustmentMenu(plugin: Plugin, parent: HTMLElement): void {
    const detailAdjustmentItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-detail-adjustment");
    if (!detailAdjustmentItem) return;
    const detailAdjustmentSubmenu = detailAdjustmentItem.querySelector<HTMLElement>(".b3-menu__submenu .b3-menu__items");
    if (!detailAdjustmentSubmenu) return;
    if (!detailAdjustmentSubmenu.querySelector(".menu-item__subtitle")) {
        const subtitle = document.createElement("div");
        subtitle.className = "menu-item__subtitle asri-enhance-windowtransparencyvalue-subtitle";
        subtitle.style.userSelect = "none";
        subtitle.style.padding = "0 14px";
        subtitle.textContent = plugin.i18n?.windowTransparencyValueSubtitle || "windowTransparencyValueSubtitle";
        detailAdjustmentSubmenu.appendChild(subtitle);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-wholewindowtransparency")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-wholewindowtransparency";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.wholeWindowTransparency || "wholeWindowTransparency"}</span>`;
        detailAdjustmentSubmenu.appendChild(button);
    }
    const wholeWindowItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-wholewindowtransparency");
    if (wholeWindowItem) {
        wholeWindowItem.onclick = (e) => onWholeWindowTransparencyClick(plugin, e);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-windowtransparencyvalue")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-windowtransparencyvalue";
        button.innerHTML = `<div aria-label="${plugin.i18n?.windowTransparencyValue || "windowTransparencyValue"}: 0.5" class="b3-tooltips b3-tooltips__n"><input style="box-sizing: border-box" type="range" class="b3-slider fn__block" min="0" max="1" step="0.05" value="0.5"></div>`;
        detailAdjustmentSubmenu.appendChild(button);
    }
    const windowTransparencyItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-windowtransparencyvalue");
    if (windowTransparencyItem) {
        windowTransparencyItem.onclick = (e) => onWindowTransparencyValueClick(plugin, e);
        const slider = windowTransparencyItem.querySelector<HTMLInputElement>("input[type='range']");
        if (slider) {
            loadData(plugin, "config.json").then((config) => {
                const savedValue = config?.["asri-enhance-windowtransparencyvalue"];
                if (savedValue !== undefined) {
                    const value = parseFloat(savedValue);
                    slider.value = String(value);
                    const label = slider.parentElement?.getAttribute("aria-label")?.split(":")[0];
                    if (label) {
                        slider.parentElement?.setAttribute("aria-label", `${label}: ${value}`);
                    }
                }
            }).catch(() => { });
            slider.addEventListener("input", async (e) => {
                const target = e.target as HTMLInputElement;
                const value = parseFloat(target.value);
                await saveWindowTransparencyValue(plugin, value);
                const label = target.parentElement?.getAttribute("aria-label")?.split(":")[0];
                if (label) {
                    target.parentElement?.setAttribute("aria-label", `${label}: ${value}`);
                }
            });
        }
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-detail-sep-1")) {
        const separator = document.createElement("button");
        separator.className = "b3-menu__separator";
        separator.id = "asri-enhance-detail-sep-1";
        detailAdjustmentSubmenu.appendChild(separator);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-sidebar-top-sticky")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-sidebar-top-sticky";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.sidebarTopSticky || "sidebarTopSticky"}</span>`;
        detailAdjustmentSubmenu.appendChild(button);
    }
    const sidebarTopStickyItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-sidebar-top-sticky");
    if (sidebarTopStickyItem) {
        sidebarTopStickyItem.onclick = (e) => onSidebarTopStickyClick(plugin, e);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-singlecolumnslashmenu")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-singlecolumnslashmenu";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.singleColumnSlashMenu || "singleColumnSlashMenu"}</span>`;
        detailAdjustmentSubmenu.appendChild(button);
    }
    const singleColumnSlashMenuItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-singlecolumnslashmenu");
    if (singleColumnSlashMenuItem) {
        singleColumnSlashMenuItem.onclick = (e) => onSingleColumnSlashMenuClick(plugin, e);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-cardsearchlist")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-cardsearchlist";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.cardSearchList || "cardSearchList"}</span>`;
        detailAdjustmentSubmenu.appendChild(button);
    }
    const cardSearchListItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-cardsearchlist");
    if (cardSearchListItem) {
        cardSearchListItem.onclick = (e) => onCardSearchListClick(plugin, e);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-detail-sep-2")) {
        const separator = document.createElement("button");
        separator.className = "b3-menu__separator";
        separator.id = "asri-enhance-detail-sep-2";
        detailAdjustmentSubmenu.appendChild(separator);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-heading")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-colored-heading";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.coloredHeading || "coloredHeading"}</span>`;
        detailAdjustmentSubmenu.appendChild(button);
    }
    const coloredHeadingItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-colored-heading");
    if (coloredHeadingItem) {
        coloredHeadingItem.onclick = (e) => onColoredHeadingClick(plugin, e);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-heading-level-hint")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-heading-level-hint";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.headingLevelHint || "headingLevelHint"}</span>`;
        if (detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-tree")) {
            const coloredTreeButton = detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-tree");
            detailAdjustmentSubmenu.insertBefore(button, coloredTreeButton);
        } else {
            detailAdjustmentSubmenu.appendChild(button);
        }
    }
    const headingLevelHintItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-heading-level-hint");
    if (headingLevelHintItem) {
        headingLevelHintItem.onclick = (e) => onHeadingLevelHintClick(plugin, e);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-tree")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-colored-tree";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.coloredTree || "coloredTree"}</span>`;
        detailAdjustmentSubmenu.appendChild(button);
    }
    const coloredTreeItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-colored-tree");
    if (coloredTreeItem) {
        coloredTreeItem.onclick = (e) => onColoredTreeClick(plugin, e);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-list")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-colored-list";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.coloredList || "coloredList"}</span>`;
        if (detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-tree")) {
            const coloredTreeButton = detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-tree");
            if (coloredTreeButton && coloredTreeButton.nextSibling) {
                detailAdjustmentSubmenu.insertBefore(button, coloredTreeButton.nextSibling);
            } else {
                detailAdjustmentSubmenu.appendChild(button);
            }
        } else {
            detailAdjustmentSubmenu.appendChild(button);
        }
    }
    const coloredListItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-colored-list");
    if (coloredListItem) {
        coloredListItem.onclick = (e) => onColoredListClick(plugin, e);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-moreanimations")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-moreanimations";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.moreAnimations || "moreAnimations"}</span>`;
        detailAdjustmentSubmenu.appendChild(button);
    }
    const moreAnimationsItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-moreanimations");
    if (moreAnimationsItem) {
        moreAnimationsItem.onclick = (e) => onMoreAnimationsClick(plugin, e);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-global-frosted-glass")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-global-frosted-glass";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.globalFrostedGlass || "globalFrostedGlass"}</span>`;
        detailAdjustmentSubmenu.appendChild(button);
    }
    const globalFrostedGlassItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-global-frosted-glass");
    if (globalFrostedGlassItem) {
        globalFrostedGlassItem.onclick = (e) => onGlobalFrostedGlassClick(plugin, e);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-detail-sep-3")) {
        const separator = document.createElement("button");
        separator.className = "b3-menu__separator";
        separator.id = "asri-enhance-detail-sep-3";
        detailAdjustmentSubmenu.appendChild(separator);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-hide-tab")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-hide-tab";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.hideTab || "hideTab"}</span>`;
        detailAdjustmentSubmenu.appendChild(button);
    }
    const hideTabItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-hide-tab");
    if (hideTabItem) {
        hideTabItem.onclick = (e) => onHideTabClick(plugin, e);
    }
    if (!detailAdjustmentSubmenu.querySelector("#asri-enhance-hide-breadcrumb")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-hide-breadcrumb";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.hideBreadcrumb || "hideBreadcrumb"}</span>`;
        detailAdjustmentSubmenu.appendChild(button);
    }
    const hideBreadcrumbItem = detailAdjustmentSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-hide-breadcrumb");
    if (hideBreadcrumbItem) {
        hideBreadcrumbItem.onclick = (e) => onHideBreadcrumbClick(plugin, e);
    }
}
function injectTextureMenu(plugin: Plugin, parent: HTMLElement): void {
    const textureItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-texture");
    if (!textureItem) return;
    const textureSubmenu = textureItem.querySelector<HTMLElement>(".b3-menu__submenu .b3-menu__items");
    if (!textureSubmenu) return;
    const textureItems = [
        { id: "paper", label: plugin.i18n?.paper || "paper", handler: onPaperClick },
        { id: "noise", label: plugin.i18n?.noise || "noise", handler: onNoiseClick },
        { id: "acrylic", label: plugin.i18n?.acrylic || "acrylic", handler: onAcrylicClick },
        { id: "checkerboard", label: plugin.i18n?.checkerboard || "checkerboard", handler: onCheckerboardClick },
        { id: "grid", label: plugin.i18n?.grid || "grid", handler: onGridClick },
        { id: "polkadot", label: plugin.i18n?.polkadot || "polkadot", handler: onPolkaDotClick },
        { id: "crossdot", label: plugin.i18n?.crossdot || "crossdot", handler: onCrossDotClick },
        { id: "honeycomb", label: plugin.i18n?.honeycomb || "honeycomb", handler: onHoneycombClick },
        { id: "wood", label: plugin.i18n?.wood || "wood", handler: onWoodClick },
        { id: "camouflage", label: plugin.i18n?.camouflage || "camouflage", handler: onCamouflageClick },
        { id: "fiber", label: plugin.i18n?.fiber || "fiber", handler: onFiberClick },
        { id: "fabric", label: plugin.i18n?.fabric || "fabric", handler: onFabricClick },
    ];
    textureItems.forEach(({ id, label, handler }) => {
        if (!textureSubmenu.querySelector(`#asri-enhance-${id}`)) {
            const button = document.createElement("button");
            button.className = "b3-menu__item";
            button.id = `asri-enhance-${id}`;
            button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${label}</span>`;
            textureSubmenu.appendChild(button);
        }
        const item = textureSubmenu.querySelector<HTMLButtonElement>(`#asri-enhance-${id}`);
        if (item) {
            item.onclick = (e) => handler(plugin, e);
        }
    });
}
function injectImmersiveMenu(plugin: Plugin, parent: HTMLElement): void {
    const immersiveItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-immersive");
    if (!immersiveItem) return;
    const immersiveSubmenu = immersiveItem.querySelector<HTMLElement>(".b3-menu__submenu .b3-menu__items");
    if (!immersiveSubmenu) return;
    if (!immersiveSubmenu.querySelector("#asri-enhance-typewriter")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-typewriter";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.typewriter || "typewriterMode"}</span>`;
        immersiveSubmenu.appendChild(button);
    }
    const typewriterItem = immersiveSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-typewriter");
    if (typewriterItem) {
        typewriterItem.onclick = (e) => onTypewriterModeClick(plugin, e);
    }
    if (!immersiveSubmenu.querySelector("#asri-enhance-focus")) {
        const button = document.createElement("button");
        button.className = "b3-menu__item";
        button.id = "asri-enhance-focus";
        button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.focus || "focusMode"}</span>`;
        immersiveSubmenu.appendChild(button);
    }
    const focusModeItem = immersiveSubmenu.querySelector<HTMLButtonElement>("#asri-enhance-focus");
    if (focusModeItem) {
        focusModeItem.onclick = (e) => onFocusModeClick(plugin, e);
    }
}
