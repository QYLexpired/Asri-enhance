import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
import { createFetchInterceptor } from "../utils/fetchInterceptor";
import { marked } from "../module/marked/marked.esm.js";
import markedKatex from "../module/marked/marked-katex-extension.js";
try {
    if (marked && typeof marked.use === "function" && typeof markedKatex === "function") {
        marked.use(markedKatex({ throwOnError: false }));
    }
}
catch (e) {
}
try {
    const globalHljs = (window as any)?.hljs;
    if (marked && typeof (marked as any).setOptions === "function") {
        (marked as any).setOptions({
            highlight: (code: string, lang: string) => {
                try {
                    if (globalHljs) {
                        if (lang && globalHljs.getLanguage && globalHljs.getLanguage(lang)) {
                            return globalHljs.highlight(code, { language: lang }).value;
                        }
                        if (globalHljs.highlightAuto) {
                            return globalHljs.highlightAuto(code).value;
                        }
                    }
                } catch (err) {}
                return code;
            },
        });
    }
} catch (e) {}
function applySyntaxHighlighting(container: HTMLElement) {
    try {
        const globalHljs = (window as any)?.hljs;
        if (!globalHljs) return;
        const codeEls = Array.from(container.querySelectorAll<HTMLElement>("pre code"));
        codeEls.forEach((el) => {
            try {
                if (typeof globalHljs.highlightElement === "function") {
                    globalHljs.highlightElement(el);
                } else {
                    const cls = el.className || "";
                    const langMatch = cls.match(/language-([a-z0-9-]+)/i);
                    const lang = (langMatch && langMatch[1]) || "";
                    const codeText = el.textContent || "";
                    if (lang && globalHljs.getLanguage && globalHljs.getLanguage(lang)) {
                        el.innerHTML = globalHljs.highlight(codeText, { language: lang }).value;
                    } else if (globalHljs.highlightAuto) {
                        el.innerHTML = globalHljs.highlightAuto(codeText).value;
                    }
                }
            } catch (err) {}
        });
    } catch (err) {}
}
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-side-memo";
function attachNoRightClick(el: HTMLElement): void {
	try {
		if (!el) return;
		if ((el as any).__asriNoRightClickAttached) return;
		(el as any).__asriNoRightClickAttached = true;
		const stopAll = (ev: Event) => {
			try {
				if (ev.type === "contextmenu") {
					ev.preventDefault();
					ev.stopPropagation();
					return;
				}
				const me = ev as MouseEvent;
				if (typeof me.button === "number" && me.button === 2) {
					try {
						me.preventDefault();
					} catch (e) {}
					try {
						me.stopPropagation();
					} catch (e) {}
				}
			} catch (e) {}
		};
		try {
			el.addEventListener("contextmenu", stopAll, {
				capture: true,
				passive: false,
			});
			el.addEventListener("mousedown", stopAll, {
				capture: true,
				passive: false,
			});
			el.addEventListener("mouseup", stopAll, {
				capture: true,
				passive: false,
			});
		} catch (e) {}
	} catch (e) {}
}
function updateAllProtyleMemoClasses(): void {
	const htmlEl = document.documentElement;
	const isActive = !!(
		htmlEl && htmlEl.hasAttribute("data-asri-enhance-side-memo")
	);
	const protyleContents = Array.from(
		document.querySelectorAll<HTMLElement>(".protyle-content"),
	);
	protyleContents.forEach((el) => {
		try {
			const hasInlineOrBlockMemo =
				el.querySelector('[data-type="inline-memo"], [memo]') !== null;
			if (isActive && hasInlineOrBlockMemo) {
				el.classList.add("asri-enhance-sidememo");
				el.classList.remove("asri-enhance-sidememo-none");
			} else {
				el.classList.remove("asri-enhance-sidememo");
				el.classList.add("asri-enhance-sidememo-none");
			}
		} catch (err) {}
	});
	if (isActive) {
		ensureSidememoContainers();
	} else {
		try {
			const leftover = Array.from(
				document.querySelectorAll<HTMLElement>(
					".asri-enhance-sidememo-container",
				),
			);
			leftover.forEach((c) => {
				try {
					c.remove();
				} catch (e) {}
			});
		} catch (e) {}
	}
}
function ensureSidememoContainers(): void {
	const titleElements = Array.from(
		document.querySelectorAll<HTMLElement>(
			".asri-enhance-sidememo .protyle-top .protyle-title",
		),
	);
	titleElements.forEach((titleEl) => {
		try {
			let container = titleEl.querySelector<HTMLElement>(
				".asri-enhance-sidememo-container",
			);
			if (!container) {
				container = document.createElement("div");
				container.className =
					"asri-enhance-sidememo-container protyle-custom";
				titleEl.appendChild(container);
			}
			try {
				attachNoRightClick(container);
			} catch (e) {}
			try {
				const computed = getComputedStyle(titleEl).position;
				if (!computed || computed === "static") {
					titleEl.style.position = "relative";
				}
			} catch (e) {}
			const protyleContent = titleEl.closest(
				".protyle-content",
			) as HTMLElement | null;
			if (protyleContent) {
				populateSidememoContainer(container, protyleContent);
				try {
					attachNoRightClick(container);
				} catch (e) {}
			}
		} catch (err) {}
	});
	const allContainers = Array.from(
		document.querySelectorAll<HTMLElement>(
			".protyle-top .protyle-title > .asri-enhance-sidememo-container",
		),
	);
	allContainers.forEach((container) => {
		const titleParent = container.parentElement;
		if (!titleParent) return;
		if (!titleParent.closest(".asri-enhance-sidememo")) {
			try {
				container.remove();
			} catch (e) {}
		} else {
			try {
				attachNoRightClick(container);
			} catch (e) {}
		}
	});
}
function populateSidememoContainer(
	container: HTMLElement,
	protyleContent: HTMLElement,
): void {
	const existingMemoEls = Array.from(
		protyleContent.querySelectorAll<HTMLElement>(
			'[data-type="inline-memo"], [memo]',
		),
	);
	existingMemoEls.forEach((m) => {
		try {
			const handlers = (m as any).__asriSidememoHandlers;
			if (handlers) {
				if (handlers.enter)
					m.removeEventListener("mouseenter", handlers.enter);
				if (handlers.leave)
					m.removeEventListener("mouseleave", handlers.leave);
				delete (m as any).__asriSidememoHandlers;
			}
		} catch (e) {}
	});
	while (container.firstChild) {
		const child = container.firstChild as HTMLElement;
		try {
			const handlers = (child as any).__asriSidememoHandlers;
			if (handlers) {
				if (handlers.enter)
					child.removeEventListener("mouseenter", handlers.enter);
				if (handlers.leave)
					child.removeEventListener("mouseleave", handlers.leave);
				if (handlers.click)
					child.removeEventListener("click", handlers.click);
				if (handlers.mousedown)
					child.removeEventListener("mousedown", handlers.mousedown);
				if (handlers._preMove)
					document.removeEventListener(
						"mousemove",
						handlers._preMove,
					);
				if (handlers._preUp)
					document.removeEventListener("mouseup", handlers._preUp);
				if (handlers._dragMove)
					document.removeEventListener(
						"mousemove",
						handlers._dragMove,
					);
				if (handlers._dragUp)
					document.removeEventListener("mouseup", handlers._dragUp);
				if (handlers._timer) clearTimeout(handlers._timer);
				try {
					if (handlers._asriContainer) {
						handlers._asriContainer.classList.remove(
							"asri-enhance-sidememo-container-resize",
						);
					}
					if (handlers._asriParent) {
						handlers._asriParent.classList.remove(
							"asri-enhance-sidememo-container-resize",
						);
					}
				} catch (e) {}
				delete (child as any).__asriSidememoHandlers;
			}
		} catch (e) {}
		container.removeChild(child);
	}
	const memoElements = Array.from(
		protyleContent.querySelectorAll<HTMLElement>(
			'[data-type="inline-memo"], [memo]',
		),
	);
	type ItemWithTop = {
		el: HTMLElement;
		top: number;
		height: number;
		uid?: string;
		sourceEl?: HTMLElement;
	};
	const items: ItemWithTop[] = [];
	memoElements.forEach((memoEl) => {
		try {
			if (
				memoEl.hasAttribute("data-type") &&
				memoEl.getAttribute("data-type") === "inline-memo"
			) {
				const titleText = (memoEl.textContent || "").trim();
				const contentText =
					memoEl.getAttribute("data-inline-memo-content") || "";
				const item = document.createElement("div");
				item.className = "asri-enhance-sidememo-inlinememo-item";
				item.style.position = "absolute";
				const title = document.createElement("div");
				title.className = "asri-enhance-sidememo-inlinememo-item-title";
				title.textContent = titleText;
				const content = document.createElement("div");
				content.className =
					"asri-enhance-sidememo-inlinememo-item-content";
				try {
					const mdHtml =
						typeof marked === "function"
							? marked(contentText)
							: marked && (marked.parse || marked.default)
								? marked.parse
									? marked.parse(contentText)
									: marked.default
										? marked.default(contentText)
										: contentText
								: contentText;
					content.innerHTML = mdHtml;
					try {
						applySyntaxHighlighting(content);
					} catch (e) {}
				} catch (e) {
					content.textContent = contentText;
				}
				item.appendChild(title);
				item.appendChild(content);
				let top = 0;
				try {
					const memoRect = memoEl.getBoundingClientRect();
					const titleRect =
						container.parentElement?.getBoundingClientRect();
					if (titleRect) {
						top = Math.max(0, memoRect.top - titleRect.bottom + 4);
					} else {
						const protyleRect =
							protyleContent.getBoundingClientRect();
						top = Math.max(0, memoRect.top - protyleRect.top);
					}
				} catch (e) {}
				let uid = memoEl.getAttribute("asri-enhance-sidememo-uid");
				if (!uid) {
					uid = `asri-enhance-sidememo-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
					try {
						memoEl.setAttribute("asri-enhance-sidememo-uid", uid);
					} catch (e) {}
				}
				item.setAttribute("asri-enhance-sidememo-uid", uid);
				item.style.top = `${top}px`;
				items.push({ el: item, top, height: 0, uid, sourceEl: memoEl });
			} else if (memoEl.hasAttribute("memo")) {
				const titleText = (memoEl.textContent || "").trim();
				const contentText = memoEl.getAttribute("memo") || "";
				const item = document.createElement("div");
				item.className = "asri-enhance-sidememo-blockmemo-item";
				item.style.position = "absolute";
				const title = document.createElement("div");
				title.className = "asri-enhance-sidememo-blockmemo-item-title";
				title.textContent = titleText;
				const content = document.createElement("div");
				content.className =
					"asri-enhance-sidememo-blockmemo-item-content";
				try {
					const mdHtml =
						typeof marked === "function"
							? marked(contentText)
							: marked && (marked.parse || marked.default)
								? marked.parse
									? marked.parse(contentText)
									: marked.default
										? marked.default(contentText)
										: contentText
								: contentText;
					content.innerHTML = mdHtml;
					try {
						applySyntaxHighlighting(content);
					} catch (e) {}
				} catch (e) {
					content.textContent = contentText;
				}
				item.appendChild(title);
				item.appendChild(content);
				let top = 0;
				try {
					const memoRect = memoEl.getBoundingClientRect();
					const titleRect =
						container.parentElement?.getBoundingClientRect();
					if (titleRect) {
						top = Math.max(0, memoRect.top - titleRect.bottom + 4);
					} else {
						const protyleRect =
							protyleContent.getBoundingClientRect();
						top = Math.max(0, memoRect.top - protyleRect.top);
					}
				} catch (e) {}
				let uid = memoEl.getAttribute("asri-enhance-sidememo-uid");
				if (!uid) {
					uid = `asri-enhance-sidememo-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
					try {
						memoEl.setAttribute("asri-enhance-sidememo-uid", uid);
					} catch (e) {}
				}
				item.setAttribute("asri-enhance-sidememo-uid", uid);
				item.style.top = `${top}px`;
				items.push({ el: item, top, height: 0, uid, sourceEl: memoEl });
			}
		} catch (err) {}
	});
	const frag = document.createDocumentFragment();
	items.forEach((it) => frag.appendChild(it.el));
	container.appendChild(frag);
	items.forEach((it) => {
		try {
			it.height = Math.ceil(it.el.getBoundingClientRect().height);
		} catch (e) {
			it.height = 0;
		}
	});
	const GAP = 8;
	items.sort((a, b) => a.top - b.top);
	let cursor = 0;
	items.forEach((it) => {
		const desiredTop = Math.max(0, it.top);
		const finalTop = Math.max(desiredTop, cursor);
		it.el.style.top = `${finalTop}px`;
		cursor = finalTop + it.height + GAP;
	});
	items.forEach((it) => {
		try {
			const related = it.sourceEl ?? null;
			if (!related) return;
			const onItemEnter = () =>
				related.classList.add("asri-enhance-sidememo-highlight");
			const onItemLeave = () =>
				related.classList.remove("asri-enhance-sidememo-highlight");
			const onMemoEnter = () =>
				it.el.classList.add("asri-enhance-sidememo-highlight");
			const onMemoLeave = () =>
				it.el.classList.remove("asri-enhance-sidememo-highlight");
			it.el.addEventListener("mouseenter", onItemEnter);
			it.el.addEventListener("mouseleave", onItemLeave);
			related.addEventListener("mouseenter", onMemoEnter);
			related.addEventListener("mouseleave", onMemoLeave);
			const onItemMouseDown = (startEvent: MouseEvent) => {
				if (startEvent.button !== 0) return;
				let lastClientX = startEvent.clientX;
				let lastClientY = startEvent.clientY;
				const preMove = (moveEv: MouseEvent) => {
					lastClientX = moveEv.clientX;
					lastClientY = moveEv.clientY;
					if (
						Math.abs(moveEv.clientX - startEvent.clientX) > 6 ||
						Math.abs(moveEv.clientY - startEvent.clientY) > 6
					) {
						if (
							(it.el as any).__asriSidememoHandlers &&
							(it.el as any).__asriSidememoHandlers._timer
						) {
							clearTimeout(
								(it.el as any).__asriSidememoHandlers._timer,
							);
							(it.el as any).__asriSidememoHandlers._timer = null;
						}
						document.removeEventListener("mousemove", preMove);
						document.removeEventListener("mouseup", cancelBefore);
					}
				};
				const cancelBefore = () => {
					if (
						(it.el as any).__asriSidememoHandlers &&
						(it.el as any).__asriSidememoHandlers._timer
					) {
						clearTimeout(
							(it.el as any).__asriSidememoHandlers._timer,
						);
						(it.el as any).__asriSidememoHandlers._timer = null;
					}
					document.removeEventListener("mousemove", preMove);
					document.removeEventListener("mouseup", cancelBefore);
				};
				document.addEventListener("mousemove", preMove);
				document.addEventListener("mouseup", cancelBefore);
				const timerId = window.setTimeout(() => {
					document.removeEventListener("mousemove", preMove);
					document.removeEventListener("mouseup", cancelBefore);
					const startX = lastClientX;
					const asriParent = related.closest(
						".asri-enhance-sidememo",
					) as HTMLElement | null;
					if (!asriParent) return;
					const containerEl = container;
					try {
						containerEl.classList.add(
							"asri-enhance-sidememo-container-resize",
						);
					} catch (e) {}
					const widthStr =
						getComputedStyle(asriParent).getPropertyValue(
							"--asri-enhance-sidememo-container-width",
						) || "";
					const initialWidth = Math.max(
						100,
						Math.min(500, Math.round(parseFloat(widthStr) || 200)),
					);
					let dragMove: ((ev: MouseEvent) => void) | null = null;
					let dragUp: (() => void) | null = null;
					dragMove = (mv: MouseEvent) => {
						try {
							const newWidth = Math.max(
								100,
								Math.min(
									500,
									Math.round(
										initialWidth + (startX - mv.clientX),
									),
								),
							);
							asriParent.style.setProperty(
								"--asri-enhance-sidememo-container-width",
								`${newWidth}px`,
							);
						} catch (e) {}
					};
					dragUp = () => {
						try {
							if (dragMove)
								document.removeEventListener(
									"mousemove",
									dragMove,
								);
							if (dragUp)
								document.removeEventListener("mouseup", dragUp);
						} catch (e) {}
						const handlers = (it.el as any).__asriSidememoHandlers;
						if (handlers) {
							try {
								if (handlers._asriContainer) {
									handlers._asriContainer.classList.remove(
										"asri-enhance-sidememo-container-resize",
									);
								}
								if (handlers._asriParent) {
									handlers._asriParent.classList.remove(
										"asri-enhance-sidememo-container-resize",
									);
								}
							} catch (e) {}
							handlers._dragMove = null;
							handlers._dragUp = null;
							handlers._asriParent = null;
							handlers._asriContainer = null;
						}
					};
					const handlers =
						(it.el as any).__asriSidememoHandlers || {};
					handlers._dragMove = dragMove;
					handlers._dragUp = dragUp;
					handlers._asriParent = asriParent;
					handlers._asriContainer = containerEl;
					(it.el as any).__asriSidememoHandlers = handlers;
					document.addEventListener("mousemove", dragMove);
					document.addEventListener("mouseup", dragUp);
				}, 300);
				const handlers = (it.el as any).__asriSidememoHandlers || {};
				handlers._preMove = preMove;
				handlers._preUp = cancelBefore;
				handlers._timer = timerId;
				(it.el as any).__asriSidememoHandlers = handlers;
			};
			try {
				const titleEl = it.el.querySelector<HTMLElement>(
					".asri-enhance-sidememo-inlinememo-item-title, .asri-enhance-sidememo-blockmemo-item-title",
				);
				if (titleEl) {
					const onTitleClick = (ev: MouseEvent) => {
						try {
							ev.preventDefault();
							ev.stopPropagation();
						} catch (e) {}
						try {
							if (
								related.hasAttribute &&
								related.hasAttribute("memo")
							) {
								let targetEl: HTMLElement | null = null;
								try {
									targetEl =
										related.querySelector<HTMLElement>(
											".protyle-attr .protyle-attr--memo",
										);
								} catch (e) {
									targetEl = null;
								}
								const rect = (
									targetEl ?? related
								).getBoundingClientRect();
								const clientX = Math.round(
									rect.left + rect.width / 2,
								);
								const clientY = Math.round(
									rect.top + rect.height / 2,
								);
								const clickEvent = new MouseEvent("click", {
									bubbles: true,
									cancelable: true,
									view: window,
									button: 0,
									clientX,
									clientY,
								});
								try {
									if (targetEl) {
										targetEl.dispatchEvent(clickEvent);
									} else {
										related.dispatchEvent(clickEvent);
									}
								} catch (e) {}
							} else {
								const targetRect =
									related.getBoundingClientRect();
								const clientX = Math.round(
									targetRect.left + targetRect.width / 2,
								);
								const clientY = Math.round(
									targetRect.top + targetRect.height / 2,
								);
								const ctxEvent = new MouseEvent("contextmenu", {
									bubbles: true,
									cancelable: true,
									view: window,
									button: 2,
									clientX,
									clientY,
								});
								try {
									related.dispatchEvent(ctxEvent);
								} catch (e) {}
							}
						} catch (e) {}
					};
					titleEl.addEventListener("click", onTitleClick);
					const prev = (it.el as any).__asriSidememoHandlers || {};
					const merged = Object.assign(prev, {
						enter: onItemEnter,
						leave: onItemLeave,
						click: onTitleClick,
						mousedown: onItemMouseDown,
					});
					(it.el as any).__asriSidememoHandlers = merged;
					it.el.addEventListener("mousedown", onItemMouseDown);
				} else {
					const prev = (it.el as any).__asriSidememoHandlers || {};
					const merged = Object.assign(prev, {
						enter: onItemEnter,
						leave: onItemLeave,
						mousedown: onItemMouseDown,
					});
					(it.el as any).__asriSidememoHandlers = merged;
					it.el.addEventListener("mousedown", onItemMouseDown);
				}
			} catch (e) {
				const prev = (it.el as any).__asriSidememoHandlers || {};
				const merged = Object.assign(prev, {
					enter: onItemEnter,
					leave: onItemLeave,
					mousedown: onItemMouseDown,
				});
				(it.el as any).__asriSidememoHandlers = merged;
				it.el.addEventListener("mousedown", onItemMouseDown);
			}
			try {
				(related as any).__asriSidememoHandlers = {
					enter: onMemoEnter,
					leave: onMemoLeave,
				};
			} catch (e) {}
		} catch (e) {}
	});
}
let fetchInterceptorDisconnect: (() => void) | null = null;
export function removeAllSidememoArtifacts(): void {
	try {
		const containers = Array.from(
			document.querySelectorAll<HTMLElement>(
				".asri-enhance-sidememo-container",
			),
		);
		containers.forEach((container) => {
			try {
				Array.from(container.children).forEach((child) => {
					try {
						const handlers = (child as any).__asriSidememoHandlers;
						if (handlers) {
							if (handlers.enter)
								child.removeEventListener(
									"mouseenter",
									handlers.enter,
								);
							if (handlers.leave)
								child.removeEventListener(
									"mouseleave",
									handlers.leave,
								);
							if (handlers.click)
								child.removeEventListener(
									"click",
									handlers.click,
								);
							if (handlers.mousedown)
								child.removeEventListener(
									"mousedown",
									handlers.mousedown,
								);
							if (handlers._preMove)
								document.removeEventListener(
									"mousemove",
									handlers._preMove,
								);
							if (handlers._preUp)
								document.removeEventListener(
									"mouseup",
									handlers._preUp,
								);
							if (handlers._dragMove)
								document.removeEventListener(
									"mousemove",
									handlers._dragMove,
								);
							if (handlers._dragUp)
								document.removeEventListener(
									"mouseup",
									handlers._dragUp,
								);
							if (handlers._timer) clearTimeout(handlers._timer);
							if (handlers._asriContainer)
								try {
									handlers._asriContainer.classList.remove(
										"asri-enhance-sidememo-container-resize",
									);
								} catch (e) {}
							if (handlers._asriParent)
								try {
									handlers._asriParent.classList.remove(
										"asri-enhance-sidememo-container-resize",
									);
								} catch (e) {}
							delete (child as any).__asriSidememoHandlers;
						}
					} catch (e) {}
				});
				try {
					container.remove();
				} catch (e) {}
			} catch (e) {}
		});
		const protyles = Array.from(
			document.querySelectorAll<HTMLElement>(".protyle-content"),
		);
		protyles.forEach((el) => {
			try {
				el.classList.remove("asri-enhance-sidememo");
				el.classList.remove("asri-enhance-sidememo-none");
				const memos = Array.from(
					el.querySelectorAll<HTMLElement>(
						'[data-type="inline-memo"], [memo]',
					),
				);
				memos.forEach((m) => {
					try {
						const handlers = (m as any).__asriSidememoHandlers;
						if (handlers) {
							if (handlers.enter)
								m.removeEventListener(
									"mouseenter",
									handlers.enter,
								);
							if (handlers.leave)
								m.removeEventListener(
									"mouseleave",
									handlers.leave,
								);
							delete (m as any).__asriSidememoHandlers;
						}
						try {
							m.removeAttribute("asri-enhance-sidememo-uid");
						} catch (e) {}
						try {
							m.classList.remove(
								"asri-enhance-sidememo-highlight",
							);
						} catch (e) {}
					} catch (e) {}
				});
			} catch (e) {}
		});
		const remaining = Array.from(
			document.querySelectorAll<HTMLElement>(
				".asri-enhance-sidememo-container-resize",
			),
		);
		remaining.forEach((el) => {
			try {
				el.classList.remove("asri-enhance-sidememo-container-resize");
			} catch (e) {}
		});
	} catch (e) {}
}
async function startObserver(): Promise<void> {
	if (fetchInterceptorDisconnect) {
		return;
	}
	try {
		const interceptor = createFetchInterceptor(
			/setUILayout|transactions|setBlockAttrs|getDoc/,
			(_url?: string) => {
				try {
					setTimeout(() => {
						try {
							updateAllProtyleMemoClasses();
							ensureSidememoContainers();
						} catch (err) {}
					}, 200);
				} catch (err) {}
			},
		);
		fetchInterceptorDisconnect = () => {
			try {
				interceptor.disconnect();
			} catch (err) {}
			fetchInterceptorDisconnect = null;
		};
	} catch (err) {}
}
export function stopObserver(): void {
	if (fetchInterceptorDisconnect) {
		try {
			fetchInterceptorDisconnect();
		} catch (err) {}
		fetchInterceptorDisconnect = null;
	}
}
export async function onSideMemoClick(
	plugin: Plugin,
	event?: MouseEvent,
): Promise<void> {
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}
	const htmlEl = document.documentElement;
	if (!htmlEl) {
		return;
	}
	const isActive = htmlEl.hasAttribute("data-asri-enhance-side-memo");
	const config = (await loadData(plugin, CONFIG_FILE)) || {};
	if (isActive) {
		htmlEl.removeAttribute("data-asri-enhance-side-memo");
		config[CONFIG_KEY] = false;
		removeAllSidememoArtifacts();
		updateAllProtyleMemoClasses();
		stopObserver();
	} else {
		htmlEl.setAttribute("data-asri-enhance-side-memo", "true");
		config[CONFIG_KEY] = true;
		updateAllProtyleMemoClasses();
		startObserver().catch(() => {});
	}
	await saveData(plugin, CONFIG_FILE, config).catch(() => {});
}
export async function applySidememoConfig(
	plugin: Plugin,
	config?: Record<string, any> | null,
): Promise<void> {
	const htmlEl = document.documentElement;
	if (!htmlEl) {
		return;
	}
	const configData =
		config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
	if (configData && configData[CONFIG_KEY] === true) {
		htmlEl.setAttribute("data-asri-enhance-side-memo", "true");
		updateAllProtyleMemoClasses();
		startObserver().catch(() => {});
	} else {
		htmlEl.removeAttribute("data-asri-enhance-side-memo");
		removeAllSidememoArtifacts();
		updateAllProtyleMemoClasses();
		stopObserver();
	}
}
