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
import { onListBulletLineClick } from "../more/listbulletline";
import { onVerticalTabClick } from "../more/verticaltab";
import { onSideMemoClick } from "../more/sidememo";
import { onGlobalFrostedGlassClick } from "../detail/globalfrostedglass";
import { onSidebarTopStickyClick } from "../detail/sidebartopsticky";
import { onCoverImageFadeClick } from "../detail/coverimagefade";
import { onHideTabBreadcrumbClick } from "../detail/hidetabandbreadcrumb";
import { onMoreAnimationsClick } from "../detail/moreanimations";
import { onSingleColumnSlashMenuClick } from "../detail/singlecolumnslashmenu";
import { onWindowTransparencyValueClick, saveWindowTransparencyValue } from "../detail/windowtransparencyvalue";
import { onWholeWindowTransparencyClick } from "../detail/wholewindowtransparency";
import { onSmoothCaretClick } from "../more/smoothcaret";
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
import { loadData } from "../utils/storage";
import { onFollowTimeClick } from "../followtime/followtime";
const PALETTE_ICON_SVG = '<svg class="b3-menu__icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g></svg>';
const MORE_ICON_SVG = '<svg class="b3-menu__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M512 443.733333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 443.733333z m0-238.933333a68.266667 68.266667 0 1 1-0.034133 136.567467A68.266667 68.266667 0 0 1 512 204.8z m0 477.866667a68.266667 68.266667 0 1 1-0.034133 136.567466A68.266667 68.266667 0 0 1 512 682.666667z" fill="currentColor"></path></svg>';
export type Unsubscribe = () => void;
export function listenBarModeClick(plugin: Plugin, callback: (event: MouseEvent) => void, delayMs: number = 200): Unsubscribe {
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
                const pickColor = document.querySelector<HTMLElement>('#commonMenu[data-name="barmode"] #pickColor');
                if (pickColor) {
                    const parent = pickColor.parentElement;
                    if (parent) {
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
                        const amberItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-amber");
                        if (amberItem) {
                            amberItem.onclick = (event) => onAmberClick(plugin, event);
                        }
                        const sakuraItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-sakura");
                        if (sakuraItem) {
                            sakuraItem.onclick = (event) => onSakuraClick(plugin, event);
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
                        const glitchItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-glitch");
                        if (glitchItem) {
                            glitchItem.onclick = (event) => onGlitchClick(plugin, event);
                        }
                        const nostalgiaItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-nostalgia");
                        if (nostalgiaItem) {
                            nostalgiaItem.onclick = (event) => onNostalgiaClick(plugin, event);
                        }
                        const followCoverImgColor = document.querySelector<HTMLElement>('#commonMenu[data-name="barmode"] #followCoverImgColor');
                        if (followCoverImgColor && !parent.querySelector("#asri-enhance-follow-time")) {
                            const followTimeButton = document.createElement("button");
                            followTimeButton.className = "b3-menu__item asri-enhance";
                            followTimeButton.id = "asri-enhance-follow-time";
                            followTimeButton.innerHTML = `<svg class="b3-menu__icon"></svg><span class="b3-menu__label">${plugin.i18n?.followTime || "Follow Time"}</span>`;
                            if (followCoverImgColor.nextSibling) {
                                parent.insertBefore(followTimeButton, followCoverImgColor.nextSibling);
                            } else {
                                parent.appendChild(followTimeButton);
                            }
                            followTimeButton.onclick = (event) => onFollowTimeClick(plugin, event);
                        }
                    }
                    callback(event);
                    return;
                }
                if (searchAttempt + 1 < maxAttempts) {
                    schedulePickColorPoll(() => findPickColor(searchAttempt + 1), searchIntervalMs);
                }
                else {
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
        }
        else {
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
export function addMoreAfterTopbarFusionPlus(plugin: Plugin, delayMs: number = 200): Unsubscribe {
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
                const topbarFusionPlus = document.querySelector<HTMLElement>('#commonMenu[data-name="barmode"] #topbarFusionPlus');
                if (topbarFusionPlus) {
                    const parent = topbarFusionPlus.parentElement;
                    if (parent) {
                        if (!parent.querySelector("#asri-enhance-more")) {
                            const button = document.createElement("button");
                            button.className = "b3-menu__item asri-enhance";
                            button.id = "asri-enhance-more";
                            button.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.more || "more"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"><button class="b3-menu__item" id="asri-enhance-detail-adjustment">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.detailAdjustment || "detailAdjustment"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"></div></div></button><button class="b3-menu__item" id="asri-enhance-texture">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.texture || "texture"}</span><svg class="b3-menu__icon b3-menu__icon--small"><use xlink:href="#iconRight"></use></svg><div class="b3-menu__submenu"><div class="b3-menu__items"></div></div></button><button class="b3-menu__item" id="asri-enhance-list-bullet-line">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.listBulletLine || "listBulletLine"}</span></button><button class="b3-menu__item" id="asri-enhance-vertical-tab">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.verticalTab || "verticalTab"}</span></button><button class="b3-menu__item" id="asri-enhance-sidememo">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.sidememo || "sidememo"}</span></button><button class="b3-menu__item" id="asri-enhance-smooth-caret">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.smoothCaret || "smoothCaret"}</span></button><button class="b3-menu__item" id="asri-enhance-island-layout">${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.islandLayout || "islandLayout"}</span></button></div></div>`;
                            if (topbarFusionPlus.nextSibling) {
                                parent.insertBefore(button, topbarFusionPlus.nextSibling);
                            }
                            else {
                                parent.appendChild(button);
                            }
                        }
                        const listBulletLineItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-list-bullet-line");
                        if (listBulletLineItem) {
                            listBulletLineItem.onclick = (event) => onListBulletLineClick(plugin, event);
                        }
                        const verticalTabItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-vertical-tab");
                        if (verticalTabItem) {
                            verticalTabItem.onclick = (event) => onVerticalTabClick(plugin, event);
                        }
                        const sideMemoItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-sidememo");
                        if (sideMemoItem) {
                            sideMemoItem.onclick = (event) => onSideMemoClick(plugin, event);
                        }
                        const smoothCaretItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-smooth-caret");
                        if (smoothCaretItem) {
                            smoothCaretItem.onclick = (event) => onSmoothCaretClick(plugin, event);
                        }
                        const islandLayoutItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-island-layout");
                        if (islandLayoutItem) {
                            islandLayoutItem.onclick = (event) => onIslandLayoutClick(plugin, event);
                        }
                        const detailAdjustmentItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-detail-adjustment");
                        if (detailAdjustmentItem) {
                            const detailAdjustmentSubmenu = detailAdjustmentItem.querySelector<HTMLElement>(".b3-menu__submenu .b3-menu__items");
                            if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-windowtransparencyvalue")) {
                                const subtitle = document.createElement("div");
                                subtitle.className = "menu-item__subtitle";
                                subtitle.style.userSelect = "none";
                                subtitle.style.padding = "0 14px";
                                subtitle.textContent = plugin.i18n?.windowTransparencyValueSubtitle || "windowTransparencyValueSubtitle";
                                detailAdjustmentSubmenu.appendChild(subtitle);
                            }
                            if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-wholewindowtransparency")) {
                                const wholeWindowTransparencyButton = document.createElement("button");
                                wholeWindowTransparencyButton.className = "b3-menu__item";
                                wholeWindowTransparencyButton.id = "asri-enhance-wholewindowtransparency";
                                wholeWindowTransparencyButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.wholeWindowTransparency || "wholeWindowTransparency"}</span>`;
                                detailAdjustmentSubmenu.appendChild(wholeWindowTransparencyButton);
                            }
                            const wholeWindowTransparencyItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-wholewindowtransparency");
                            if (wholeWindowTransparencyItem) {
                                wholeWindowTransparencyItem.onclick = (event) => onWholeWindowTransparencyClick(plugin, event);
                            }
                            if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-windowtransparencyvalue")) {
                                const windowTransparencyValueButton = document.createElement("button");
                                windowTransparencyValueButton.className = "b3-menu__item";
                                windowTransparencyValueButton.id = "asri-enhance-windowtransparencyvalue";
                                windowTransparencyValueButton.innerHTML = `<div aria-label="${plugin.i18n?.windowTransparencyValue || "windowTransparencyValue"}: 0.5" class="b3-tooltips b3-tooltips__n"><input style="box-sizing: border-box" type="range" class="b3-slider fn__block" min="0" max="1" step="0.05" value="0.5"></div>`;
                                detailAdjustmentSubmenu.appendChild(windowTransparencyValueButton);
                            }
                            const windowTransparencyValueItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-windowtransparencyvalue");
                            if (windowTransparencyValueItem) {
                                windowTransparencyValueItem.onclick = (event) => onWindowTransparencyValueClick(plugin, event);
                                const slider = windowTransparencyValueItem.querySelector<HTMLInputElement>("input[type='range']");
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
                                    slider.addEventListener("input", async (event) => {
                                        const target = event.target as HTMLInputElement;
                                        const value = parseFloat(target.value);
                                        await saveWindowTransparencyValue(plugin, value);
                                        const label = target.parentElement?.getAttribute("aria-label")?.split(":")[0];
                                        if (label) {
                                            target.parentElement?.setAttribute("aria-label", `${label}: ${value}`);
                                        }
                                    });
                                }
                            }
                            if (detailAdjustmentSubmenu) {
                                const separator = document.createElement("button");
                                separator.className = "b3-menu__separator";
                                detailAdjustmentSubmenu.appendChild(separator);
                            }
                            if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-sidebar-top-sticky")) {
                                const sidebarTopStickyButton = document.createElement("button");
                                sidebarTopStickyButton.className = "b3-menu__item";
                                sidebarTopStickyButton.id = "asri-enhance-sidebar-top-sticky";
                                sidebarTopStickyButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.sidebarTopSticky || "sidebarTopSticky"}</span>`;
                                detailAdjustmentSubmenu.appendChild(sidebarTopStickyButton);
                            }
                            const sidebarTopStickyItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-sidebar-top-sticky");
                            if (sidebarTopStickyItem) {
                                sidebarTopStickyItem.onclick = (event) => onSidebarTopStickyClick(plugin, event);
                            }
                            if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-singlecolumnslashmenu")) {
                                const singleColumnSlashMenuButton = document.createElement("button");
                                singleColumnSlashMenuButton.className = "b3-menu__item";
                                singleColumnSlashMenuButton.id = "asri-enhance-singlecolumnslashmenu";
                                singleColumnSlashMenuButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.singleColumnSlashMenu || "singleColumnSlashMenu"}</span>`;
                                detailAdjustmentSubmenu.appendChild(singleColumnSlashMenuButton);
                            }
                            const singleColumnSlashMenuItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-singlecolumnslashmenu");
                            if (singleColumnSlashMenuItem) {
                                singleColumnSlashMenuItem.onclick = (event) => onSingleColumnSlashMenuClick(plugin, event);
                            }
                            if (detailAdjustmentSubmenu) {
                                const separator = document.createElement("button");
                                separator.className = "b3-menu__separator";
                                detailAdjustmentSubmenu.appendChild(separator);
                            }
                            if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-cover-image-fade")) {
                                const coverImageFadeButton = document.createElement("button");
                                coverImageFadeButton.className = "b3-menu__item";
                                coverImageFadeButton.id = "asri-enhance-cover-image-fade";
                                coverImageFadeButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.coverImageFade || "coverImageFade"}</span>`;
                                detailAdjustmentSubmenu.appendChild(coverImageFadeButton);
                            }
                            const coverImageFadeItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-cover-image-fade");
                            if (coverImageFadeItem) {
                                coverImageFadeItem.onclick = (event) => onCoverImageFadeClick(plugin, event);
                            }
                            if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-heading")) {
                                const coloredHeadingButton = document.createElement("button");
                                coloredHeadingButton.className = "b3-menu__item";
                                coloredHeadingButton.id = "asri-enhance-colored-heading";
                                coloredHeadingButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.coloredHeading || "coloredHeading"}</span>`;
                                detailAdjustmentSubmenu.appendChild(coloredHeadingButton);
                            }
                            const coloredHeadingItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-colored-heading");
                            if (coloredHeadingItem) {
                                coloredHeadingItem.onclick = (event) => onColoredHeadingClick(plugin, event);
                            }
                            if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-heading-level-hint")) {
                                const headingLevelHintButton = document.createElement("button");
                                headingLevelHintButton.className = "b3-menu__item";
                                headingLevelHintButton.id = "asri-enhance-heading-level-hint";
                                headingLevelHintButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.headingLevelHint || "headingLevelHint"}</span>`;
                                if (detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-tree")) {
                                    const coloredTreeButton = detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-tree");
                                    detailAdjustmentSubmenu.insertBefore(headingLevelHintButton, coloredTreeButton);
                                }
                                else {
                                    detailAdjustmentSubmenu.appendChild(headingLevelHintButton);
                                }
                            }
                            const headingLevelHintItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-heading-level-hint");
                            if (headingLevelHintItem) {
                                headingLevelHintItem.onclick = (event) => onHeadingLevelHintClick(plugin, event);
                            }
                            if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-colored-tree")) {
                                const coloredTreeButton = document.createElement("button");
                                coloredTreeButton.className = "b3-menu__item";
                                coloredTreeButton.id = "asri-enhance-colored-tree";
                                coloredTreeButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.coloredTree || "coloredTree"}</span>`;
                                detailAdjustmentSubmenu.appendChild(coloredTreeButton);
                            }
                            const coloredTreeItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-colored-tree");
                            if (coloredTreeItem) {
                                coloredTreeItem.onclick = (event) => onColoredTreeClick(plugin, event);
                            }
                            if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-moreanimations")) {
                                const moreAnimationsButton = document.createElement("button");
                                moreAnimationsButton.className = "b3-menu__item";
                                moreAnimationsButton.id = "asri-enhance-moreanimations";
                                moreAnimationsButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.moreAnimations || "moreAnimations"}</span>`;
                                detailAdjustmentSubmenu.appendChild(moreAnimationsButton);
                            }
                            const moreAnimationsItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-moreanimations");
                            if (moreAnimationsItem) {
                                moreAnimationsItem.onclick = (event) => onMoreAnimationsClick(plugin, event);
                            }
                            if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-global-frosted-glass")) {
                                const globalFrostedGlassButton = document.createElement("button");
                                globalFrostedGlassButton.className = "b3-menu__item";
                                globalFrostedGlassButton.id = "asri-enhance-global-frosted-glass";
                                globalFrostedGlassButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.globalFrostedGlass || "globalFrostedGlass"}</span>`;
                                detailAdjustmentSubmenu.appendChild(globalFrostedGlassButton);
                            }
                            const globalFrostedGlassItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-global-frosted-glass");
                            if (globalFrostedGlassItem) {
                                globalFrostedGlassItem.onclick = (event) => onGlobalFrostedGlassClick(plugin, event);
                            }
                            if (detailAdjustmentSubmenu) {
                                const separator = document.createElement("button");
                                separator.className = "b3-menu__separator";
                                detailAdjustmentSubmenu.appendChild(separator);
                            }
                            if (detailAdjustmentSubmenu && !detailAdjustmentSubmenu.querySelector("#asri-enhance-hide-tab-breadcrumb")) {
                                const hideTabBreadcrumbButton = document.createElement("button");
                                hideTabBreadcrumbButton.className = "b3-menu__item";
                                hideTabBreadcrumbButton.id = "asri-enhance-hide-tab-breadcrumb";
                                hideTabBreadcrumbButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.hideTabBreadcrumb || "hideTabBreadcrumb"}</span>`;
                                detailAdjustmentSubmenu.appendChild(hideTabBreadcrumbButton);
                            }
                            const hideTabBreadcrumbItem = detailAdjustmentSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-hide-tab-breadcrumb");
                            if (hideTabBreadcrumbItem) {
                                hideTabBreadcrumbItem.onclick = (event) => onHideTabBreadcrumbClick(plugin, event);
                            }
                        }
                        const textureItem = parent.querySelector<HTMLButtonElement>("#asri-enhance-texture");
                        if (textureItem) {
                            const textureSubmenu = textureItem.querySelector<HTMLElement>(".b3-menu__submenu .b3-menu__items");
                            if (textureSubmenu && !textureSubmenu.querySelector("#asri-enhance-paper")) {
                                const paperButton = document.createElement("button");
                                paperButton.className = "b3-menu__item";
                                paperButton.id = "asri-enhance-paper";
                                paperButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.paper || "paper"}</span>`;
                                textureSubmenu.appendChild(paperButton);
                            }
                            if (textureSubmenu && !textureSubmenu.querySelector("#asri-enhance-noise")) {
                                const noiseButton = document.createElement("button");
                                noiseButton.className = "b3-menu__item";
                                noiseButton.id = "asri-enhance-noise";
                                noiseButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.noise || "noise"}</span>`;
                                textureSubmenu.appendChild(noiseButton);
                            }
                            if (textureSubmenu && !textureSubmenu.querySelector("#asri-enhance-acrylic")) {
                                const acrylicButton = document.createElement("button");
                                acrylicButton.className = "b3-menu__item";
                                acrylicButton.id = "asri-enhance-acrylic";
                                acrylicButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.acrylic || "acrylic"}</span>`;
                                textureSubmenu.appendChild(acrylicButton);
                            }
                            if (textureSubmenu && !textureSubmenu.querySelector("#asri-enhance-checkerboard")) {
                                const checkerboardButton = document.createElement("button");
                                checkerboardButton.className = "b3-menu__item";
                                checkerboardButton.id = "asri-enhance-checkerboard";
                                checkerboardButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.checkerboard || "checkerboard"}</span>`;
                                textureSubmenu.appendChild(checkerboardButton);
                            }
                            if (textureSubmenu && !textureSubmenu.querySelector("#asri-enhance-grid")) {
                                const gridButton = document.createElement("button");
                                gridButton.className = "b3-menu__item";
                                gridButton.id = "asri-enhance-grid";
                                gridButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.grid || "grid"}</span>`;
                                textureSubmenu.appendChild(gridButton);
                            }
                            if (textureSubmenu && !textureSubmenu.querySelector("#asri-enhance-polkadot")) {
                                const polkadotButton = document.createElement("button");
                                polkadotButton.className = "b3-menu__item";
                                polkadotButton.id = "asri-enhance-polkadot";
                                polkadotButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.polkadot || "polkadot"}</span>`;
                                textureSubmenu.appendChild(polkadotButton);
                            }
                            if (textureSubmenu && !textureSubmenu.querySelector("#asri-enhance-crossdot")) {
                                const crossdotButton = document.createElement("button");
                                crossdotButton.className = "b3-menu__item";
                                crossdotButton.id = "asri-enhance-crossdot";
                                crossdotButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.crossdot || "crossdot"}</span>`;
                                textureSubmenu.appendChild(crossdotButton);
                            }
                            if (textureSubmenu && !textureSubmenu.querySelector("#asri-enhance-honeycomb")) {
                                const honeycombButton = document.createElement("button");
                                honeycombButton.className = "b3-menu__item";
                                honeycombButton.id = "asri-enhance-honeycomb";
                                honeycombButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.honeycomb || "honeycomb"}</span>`;
                                textureSubmenu.appendChild(honeycombButton);
                            }
                            if (textureSubmenu && !textureSubmenu.querySelector("#asri-enhance-wood")) {
                                const woodButton = document.createElement("button");
                                woodButton.className = "b3-menu__item";
                                woodButton.id = "asri-enhance-wood";
                                woodButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.wood || "wood"}</span>`;
                                textureSubmenu.appendChild(woodButton);
                            }
                            if (textureSubmenu && !textureSubmenu.querySelector("#asri-enhance-camouflage")) {
                                const camouflageButton = document.createElement("button");
                                camouflageButton.className = "b3-menu__item";
                                camouflageButton.id = "asri-enhance-camouflage";
                                camouflageButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.camouflage || "camouflage"}</span>`;
                                textureSubmenu.appendChild(camouflageButton);
                            }
                            if (textureSubmenu && !textureSubmenu.querySelector("#asri-enhance-fiber")) {
                                const fiberButton = document.createElement("button");
                                fiberButton.className = "b3-menu__item";
                                fiberButton.id = "asri-enhance-fiber";
                                fiberButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.fiber || "fiber"}</span>`;
                                textureSubmenu.appendChild(fiberButton);
                            }
                            if (textureSubmenu && !textureSubmenu.querySelector("#asri-enhance-fabric")) {
                                const fabricButton = document.createElement("button");
                                fabricButton.className = "b3-menu__item";
                                fabricButton.id = "asri-enhance-fabric";
                                fabricButton.innerHTML = `${MORE_ICON_SVG}<span class="b3-menu__label">${plugin.i18n?.fabric || "fabric"}</span>`;
                                textureSubmenu.appendChild(fabricButton);
                            }
                            const paperItem = textureSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-paper");
                            if (paperItem) {
                                paperItem.onclick = (event) => onPaperClick(plugin, event);
                            }
                            const noiseItem = textureSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-noise");
                            if (noiseItem) {
                                noiseItem.onclick = (event) => onNoiseClick(plugin, event);
                            }
                            const acrylicItem = textureSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-acrylic");
                            if (acrylicItem) {
                                acrylicItem.onclick = (event) => onAcrylicClick(plugin, event);
                            }
                            const checkerboardItem = textureSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-checkerboard");
                            if (checkerboardItem) {
                                checkerboardItem.onclick = (event) => onCheckerboardClick(plugin, event);
                            }
                            const gridItem = textureSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-grid");
                            if (gridItem) {
                                gridItem.onclick = (event) => onGridClick(plugin, event);
                            }
                            const polkadotItem = textureSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-polkadot");
                            if (polkadotItem) {
                                polkadotItem.onclick = (event) => onPolkaDotClick(plugin, event);
                            }
                            const crossdotItem = textureSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-crossdot");
                            if (crossdotItem) {
                                crossdotItem.onclick = (event) => onCrossDotClick(plugin, event);
                            }
                            const honeycombItem = textureSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-honeycomb");
                            if (honeycombItem) {
                                honeycombItem.onclick = (event) => onHoneycombClick(plugin, event);
                            }
                            const woodItem = textureSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-wood");
                            if (woodItem) {
                                woodItem.onclick = (event) => onWoodClick(plugin, event);
                            }
                            const camouflageItem = textureSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-camouflage");
                            if (camouflageItem) {
                                camouflageItem.onclick = (event) => onCamouflageClick(plugin, event);
                            }
                            const fiberItem = textureSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-fiber");
                            if (fiberItem) {
                                fiberItem.onclick = (event) => onFiberClick(plugin, event);
                            }
                            const fabricItem = textureSubmenu?.querySelector<HTMLButtonElement>("#asri-enhance-fabric");
                            if (fabricItem) {
                                fabricItem.onclick = (event) => onFabricClick(plugin, event);
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
        }
        else {
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
