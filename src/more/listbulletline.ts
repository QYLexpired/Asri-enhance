import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-listbulletline";
const SELECTOR = ".asri-bullet-highlight,.asri-bullet-line";
const SELECTED_CLASS = "asri-bullet-highlight";
const LINE_CLASS = "asri-bullet-line";
const LINE_HEIGHT_VAR = "--asri-bullet-line-height";
let selectionChangeHandler: (() => void) | null = null;
const clearBulletLineMarks = () => {
	document.querySelectorAll<HTMLElement>(SELECTOR).forEach((element) => {
		element.classList.remove(SELECTED_CLASS, LINE_CLASS);
		element.style.removeProperty(LINE_HEIGHT_VAR);
	});
};
const runSelectionUpdate = () => {
	clearBulletLineMarks();
	const selection = window.getSelection();
	if (!selection || !selection.rangeCount) {
		return;
	}
	const listItems: HTMLElement[] = [];
	let node: Node | null = selection.getRangeAt(0).startContainer;
	while (node && node.nodeType !== Node.ELEMENT_NODE) {
		node = node.parentElement;
	}
	while (node) {
		const element = node as HTMLElement;
		if (element.dataset?.type === "NodeListItem") {
			listItems.push(element);
		}
		if (element.classList?.contains("protyle-wysiwyg")) {
			break;
		}
		node = element.parentElement;
	}
	listItems.forEach((item, index) => {
		item.classList.add(SELECTED_CLASS);
		if (index < listItems.length - 1) {
			const currentRect = item.getBoundingClientRect();
			const nextRect = listItems[index + 1].getBoundingClientRect();
			item.style.setProperty(LINE_HEIGHT_VAR, `${currentRect.top - nextRect.top}px`);
			item.classList.add(LINE_CLASS);
		}
	});
};
const bindSelectionChange = () => {
	if (selectionChangeHandler) {
		return;
	}
	selectionChangeHandler = () => {
		runSelectionUpdate();
	};
	document.addEventListener("selectionchange", selectionChangeHandler);
	runSelectionUpdate();
};
const unbindSelectionChange = () => {
	if (!selectionChangeHandler) {
		clearBulletLineMarks();
		return;
	}
	document.removeEventListener("selectionchange", selectionChangeHandler);
	selectionChangeHandler = null;
	clearBulletLineMarks();
};
export async function onListBulletLineClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}
	const htmlEl = document.documentElement;
	if (!htmlEl) {
		return;
	}
	const isActive = htmlEl.hasAttribute("data-asri-enhance-listbulletline");
	const config = await loadData(plugin, CONFIG_FILE) || {};
	if (isActive) {
		htmlEl.removeAttribute("data-asri-enhance-listbulletline");
		config[CONFIG_KEY] = false;
		unbindSelectionChange();
	} else {
		htmlEl.setAttribute("data-asri-enhance-listbulletline", "true");
		config[CONFIG_KEY] = true;
		bindSelectionChange();
	}
	await saveData(plugin, CONFIG_FILE, config).catch(() => {
	});
}
export async function applyListBulletLineConfig(plugin: Plugin): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) {
		return;
	}
	const config = await loadData(plugin, CONFIG_FILE);
	if (config && config[CONFIG_KEY] === true) {
		htmlEl.setAttribute("data-asri-enhance-listbulletline", "true");
		bindSelectionChange();
	} else {
		htmlEl.removeAttribute("data-asri-enhance-listbulletline");
		unbindSelectionChange();
	}
}
export const removeListBulletLineEffect = () => {
	unbindSelectionChange();
};
