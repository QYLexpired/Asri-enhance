import { getFrontend, Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
import { createFetchInterceptor } from "../utils/fetchInterceptor";
const isMobile = () => {
    return getFrontend().endsWith("mobile");
};
let globalPlugin: Plugin | null = null;
let lute: any = null;
function getLute() {
    if (!lute && typeof (window as any).Lute !== "undefined") {
        lute = ((window as any).Lute as any).New();
		lute.SetMark(true);
		lute.SetTag(true);
    }
    return lute;
}
const decodeHTML = (str: string): string => {
	const textarea = document.createElement("textarea");
	textarea.innerHTML = str;
	return textarea.value;
};
function applySyntaxHighlighting(container: HTMLElement) {
	try {
		const globalHljs = (window as any)?.hljs;
		if (!globalHljs) return;
		const codeEls = Array.from(container.querySelectorAll<HTMLElement>("pre code"));
		codeEls.forEach((el) => {
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
		});
	} catch (err) {}
}
function renderKatexInContainer(container: HTMLElement) {
	try {
		const globalKatex = (window as any)?.katex;
		if (!globalKatex) return;
		container.querySelectorAll('span.language-math').forEach((el) => {
			try {
				const text = (el.textContent || "").trim();
				if (text) {
					globalKatex.render(text, el, {
						throwOnError: false,
						displayMode: false
					});
				}
			} catch (e) {}
		});
		container.querySelectorAll('div.language-math').forEach((el) => {
			try {
				const text = (el.textContent || "").trim();
				if (text) {
					globalKatex.render(text, el, {
						throwOnError: false,
						displayMode: true
					});
				}
			} catch (e) {}
		});
	} catch (err) {}
}
async function renderMermaidInContainer(container: HTMLElement) {
	try {
		const mermaid = (window as any)?.mermaid;
		if (!mermaid) return;
		container.querySelectorAll("div.language-mermaid").forEach((el) => {
			try {
				const codeText = el.textContent || "";
				if (!codeText.trim()) return;
				const parent = el.parentElement;
				if (!parent || !parent.classList.contains("mermaid")) {
					if (parent) {
						parent.classList.add("mermaid");
					} else {
						el.classList.add("mermaid");
					}
				}
			} catch (e) {}
		});
		try {
			await mermaid.run({
				querySelector: ".asri-enhance-sidememo-container .language-mermaid"
			});
		} catch (e) {}
	} catch (err) {}
}
function renderEchartsInContainer(container: HTMLElement) {
	try {
		const echarts = (window as any)?.echarts;
		if (!echarts) return;
		container.querySelectorAll("div.language-echarts").forEach((e: HTMLElement) => {
			const cfg = (e.textContent || "").trim();
			if (!cfg) return;
			const existing = echarts.getInstanceByDom(e);
			if (existing) {
				existing.dispose();
			}
			const chart = echarts.init(e);
			let option: any;
			try {
				option = JSON.parse(cfg);
			} catch (jsonErr) {
				try {
					const fn = new Function('echarts', 'return ' + cfg);
					option = fn(echarts);
				} catch (exprErr) {
					try {
						const fn = new Function('echarts', cfg + '; return option;');
						option = fn(echarts);
					} catch (stmtErr) {
						return;
					}
				}
			}
			if (option && typeof option === 'object') {
				chart.setOption(option);
			}
		});
	} catch (err) {}
}
function renderMindmapInContainer(container: HTMLElement) {
	try {
		const echarts = (window as any)?.echarts;
		if (!echarts) return;
		container.querySelectorAll("div.language-mindmap").forEach((e: HTMLElement) => {
			const code = e.dataset.code;
			if (!code) return;
			const existing = echarts.getInstanceByDom(e);
			if (existing) {
				existing.dispose();
			}
			const chart = echarts.init(e);
			chart.setOption({
				series: [{
					type: "tree",
					data: [JSON.parse(decodeURIComponent(code))],
					left: 20,
					right: 120,
					top: 20,
					bottom: 20,
					symbolSize: 8,
					orient: "LR",
					label: { position: "left", verticalAlign: "middle", align: "right" },
					leaves: { label: { position: "right", verticalAlign: "middle", align: "left" } },
					lineStyle: { curveness: 0.5 },
					initialTreeDepth: -1,
					roam: true
				}]
			});
		});
	} catch (err) {}
}
function renderAbcInContainer(container: HTMLElement) {
	try {
		const ABCJS = (window as any)?.ABCJS;
		if (!ABCJS) return;
		container.querySelectorAll("div.language-abc").forEach((e: HTMLElement) => {
			const abc = (e.textContent || "").trim();
			if (!abc) return;
			ABCJS.renderAbc(e, abc, {}, {}, { responsive: "resize" });
		});
	} catch (err) {}
}
async function renderGraphvizInContainer(container: HTMLElement) {
	try {
		const Viz = (window as any)?.Viz;
		if (!Viz) return;
		const viz = await Viz.instance();
		container.querySelectorAll("div.language-graphviz").forEach((e: HTMLElement) => {
			const dot = (e.textContent || "").trim();
			if (!dot) return;
			const svg = viz.renderSVGElement(dot);
			svg.style.width = "100%";
			svg.style.height = "auto";
			e.innerHTML = "";
			e.appendChild(svg);
		});
	} catch (err) {}
}
function renderFlowchartInContainer(container: HTMLElement, retryCount = 0) {
	try {
		const flowchart = (window as any)?.flowchart;
		if (!flowchart) {
			if (retryCount < 50) {
				setTimeout(() => renderFlowchartInContainer(container, retryCount + 1), 100);
			}
			return;
		}
		container.querySelectorAll("div.language-flowchart").forEach((e: HTMLElement) => {
			if (e.querySelector("svg")) return;
			let code = e.dataset.flowchartCode || e.textContent || "";
			if (!code.trim()) return;
			e.dataset.flowchartCode = code;
			e.innerHTML = "";
			flowchart.parse(code).drawSVG(e);
		});
	} catch (err) {}
}
function renderPlantumlInContainer(container: HTMLElement, retryCount = 0) {
	try {
		const plantumlEncoder = (window as any)?.plantumlEncoder;
		if (!plantumlEncoder) {
			if (retryCount < 50) {
				setTimeout(() => renderPlantumlInContainer(container, retryCount + 1), 100);
			}
			return;
		}
		container.querySelectorAll("div.language-plantuml").forEach((e: HTMLElement) => {
			const code = (e.textContent || "").trim();
			if (code) {
				e.innerHTML = `<img src="https://www.plantuml.com/plantuml/svg/~1${plantumlEncoder.encode(code)}" style="width:100%;height:auto;display:block;">`;
			}
		});
	} catch (err) {}
}
function getUidFromElement(el: HTMLElement): string | null {
	try {
		const attrs = el.getAttributeNames();
		for (const attr of attrs) {
			if (attr.startsWith("asri-enhance-sidememo-uid-")) {
				return attr.replace("asri-enhance-sidememo-uid-", "");
			}
		}
	} catch (e) {}
	return null;
}
function setUidToElement(el: HTMLElement, uid: string): void {
	try {
		el.setAttribute("asri-enhance-sidememo-uid-" + uid, "");
	} catch (e) {}
}
function removeUidFromElement(el: HTMLElement, uid: string): void {
	try {
		el.removeAttribute("asri-enhance-sidememo-uid-" + uid);
	} catch (e) {}
}
async function showMergeMemoTip(): Promise<void> {
	try {
		await fetch('/api/notification/pushMsg', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				msg: globalPlugin?.i18n?.mergedSideMemoEditTip,
				timeout: 3000
			})
		});
	} catch (e) {}
}
async function initSidememoRely(): Promise<boolean> {
	try {
		const head = document.head;
		const createLink = (id: string, href: string) => {
			try {
				if (document.getElementById(id)) return;
				const link = document.createElement("link");
				link.id = id;
				link.rel = "stylesheet";
				link.type = "text/css";
				link.href = href;
				head.appendChild(link);
			} catch (e) {}
		};
		const createScript = (id: string, src: string, async = true) =>
			new Promise<void>((resolve, reject) => {
				try {
					if (document.getElementById(id)) {
						resolve();
						return;
					}
					const script = document.createElement("script");
					script.id = id;
					script.src = src;
					script.async = async;
					script.onload = () => resolve();
					script.onerror = () => reject();
					head.appendChild(script);
				} catch (e) { reject(e); }
			});
		const needKatex = !(window as any).katex;
		const needHljs = !(window as any).hljs;
		const needMermaid = !(window as any).mermaid;
		const needEcharts = !(window as any).echarts;
		const needAbcjs = !(window as any).ABCJS;
		const needGraphviz = !(window as any).Viz;
		const needFlowchart = !(window as any).flowchart;
		const needPlantuml = !(window as any).plantumlEncoder;
		if (!needKatex && !needHljs && !needMermaid && !needEcharts && !needAbcjs && !needGraphviz && !needFlowchart && !needPlantuml) {
			return true;
		}
		const resources: Array<Record<string, string>> = [];
		if (needKatex) {
			resources.push({ type: "link", id: "protyleKatexStyle", href: "/stage/protyle/js/katex/katex.min.css?v=0.16.9" });
			try {
				await createScript("protyleKatexScript", "/stage/protyle/js/katex/katex.min.js?v=0.16.9", false);
				await createScript("protyleKatexMhchemScript", "/stage/protyle/js/katex/mhchem.min.js?v=0.16.9", false);
			} catch (e) {}
		}
		if (needHljs) {
			resources.push({ type: "link", id: "protyleHljsStyle", href: "/stage/protyle/js/highlight.js/styles/github.min.css?v=11.11.1" });
			resources.push({ type: "script", id: "protyleHljsScript", src: "/stage/protyle/js/highlight.js/highlight.min.js?v=11.11.1" });
		}
		if (needMermaid) {
			try {
				await createScript("protyleMermaidScript", "/stage/protyle/js/mermaid/mermaid.min.js?v=11.13.0", false);
				await createScript("protyleMermaidZenumlScript", "/stage/protyle/js/mermaid/mermaid-zenuml.min.js?v=0.2.2", false);
			} catch (e) {}
		}
		if (needEcharts) {
			try {
				await createScript("protyleEchartsScript", "/stage/protyle/js/echarts/echarts.min.js?v=5.3.2", false);
				await createScript("protyleEchartsGLScript", "/stage/protyle/js/echarts/echarts-gl.min.js?v=2.0.9", false);
			} catch (e) {}
		}
		if (needAbcjs) {
			resources.push({ type: "script", id: "protyleAbcjsScript", src: "/stage/protyle/js/abcjs/abcjs-basic-min.js?v=6.5.0" });
		}
		if (needGraphviz) {
			resources.push({ type: "script", id: "protyleGraphVizScript", src: "/stage/protyle/js/graphviz/viz.js?v=3.11.0" });
		}
		if (needFlowchart) {
			resources.push({ type: "script", id: "protyleFlowchartScript", src: "/stage/protyle/js/flowchart.js/flowchart.min.js?v=1.18.0" });
		}
		if (needPlantuml) {
			resources.push({ type: "script", id: "protylePlantumlScript", src: "/stage/protyle/js/plantuml/plantuml-encoder.min.js?v=0.0.0" });
		}
		for (const r of resources) {
			try {
				if (r.type === "link") {
					createLink(r.id, (r as any).href);
				} else {
					await createScript(r.id, (r as any).src);
				}
			} catch (e) {}
		}
	} catch (e) {}
	return ((window as any).katex !== undefined) || ((window as any).hljs !== undefined) || ((window as any).mermaid !== undefined) || ((window as any).echarts !== undefined) || ((window as any).ABCJS !== undefined) || ((window as any).Viz !== undefined) || ((window as any).flowchart !== undefined) || ((window as any).plantumlEncoder !== undefined);
}
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-side-memo";
let sidememoDocumentRightClickHandler: ((ev: MouseEvent) => void) | null = null;
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
	const protyleTitles = Array.from(
		document.querySelectorAll<HTMLElement>(".protyle-title"),
	);
	protyleTitles.forEach((titleEl) => {
		try {
			const height = titleEl.getBoundingClientRect().height;
			titleEl.style.setProperty("--asri-enhance-sidememo-title-height", `${height}px`);
		} catch (e) {}
	});
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
				el.querySelector('[data-type*="inline-memo"], [memo]') !== null;
			if (isActive && hasInlineOrBlockMemo) {
				el.classList.add("asri-enhance-sidememo");
				el.classList.remove("asri-enhance-sidememo-none");
			} else if (isActive && !hasInlineOrBlockMemo) {
				el.classList.remove("asri-enhance-sidememo");
				el.classList.add("asri-enhance-sidememo-none");
			} else {
				el.classList.remove("asri-enhance-sidememo");
				el.classList.remove("asri-enhance-sidememo-none");
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
async function ensureSidememoContainers(): Promise<void> {
	const titleElements = Array.from(
		document.querySelectorAll<HTMLElement>(
			".asri-enhance-sidememo .protyle-top .protyle-title",
		),
	);
	for (const titleEl of titleElements) {
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
				const protyleTop = titleEl.closest(".protyle-top") as
					| HTMLElement
					| null;
				if (protyleTop) {
					if (titleEl.classList.contains("fn__none")) {
						protyleTop.classList.add(
							"asri-enhance-sidememo-protyle-title-none",
						);
					} else {
						protyleTop.classList.remove(
							"asri-enhance-sidememo-protyle-title-none",
						);
					}
				}
			} catch (e) {}
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
				await populateSidememoContainer(container, protyleContent);
				try {
					attachNoRightClick(container);
				} catch (e) {}
			}
		} catch (err) {}
	}
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
				try {
					const protyleTop = titleParent.closest(
						".protyle-top",
					) as HTMLElement | null;
					if (protyleTop) {
						protyleTop.classList.remove(
							"asri-enhance-sidememo-protyle-title-none",
						);
					}
				} catch (e) {}
				container.remove();
			} catch (e) {}
		} else {
			try {
				attachNoRightClick(container);
			} catch (e) {}
		}
	});
	if (!sidememoDocumentRightClickHandler) {
		sidememoDocumentRightClickHandler = (ev: MouseEvent) => {
			try {
				const target = ev.target as HTMLElement | null;
				if (!target || !target.closest) return;
				const titleEl = target.closest(
					".asri-enhance-sidememo-inlinememo-item-title, .asri-enhance-sidememo-blockmemo-item-title, .asri-enhance-sidememo-filememo-item-title",
				) as HTMLElement | null;
				if (!titleEl) return;
				const itemEl = titleEl.closest(
					".asri-enhance-sidememo-inlinememo-item, .asri-enhance-sidememo-blockmemo-item, .asri-enhance-sidememo-filememo-item",
				) as HTMLElement | null;
				if (!itemEl) return;
				try {
					ev.preventDefault();
					ev.stopPropagation();
				} catch (e) {}
				try {
					const wasFolded = itemEl.hasAttribute("asri-enhance-sidememo-fold");
					if (wasFolded) itemEl.removeAttribute("asri-enhance-sidememo-fold");
					else itemEl.setAttribute("asri-enhance-sidememo-fold", "");
					try {
						const uid = getUidFromElement(itemEl);
						if (uid) {
							const selector = `[data-type*="inline-memo"][asri-enhance-sidememo-uid-${uid}], [memo][asri-enhance-sidememo-uid-${uid}]`;
							const sources = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
							sources.forEach(source => {
								if (source && source.setAttribute) {
									if (!wasFolded) source.setAttribute("asri-enhance-sidememo-fold", "");
									else {
										try {
											source.removeAttribute("asri-enhance-sidememo-fold");
										} catch (e) {}
									}
								}
							});
						}
					} catch (e) {}
					try {
						updateAllProtyleMemoClasses();
						ensureSidememoContainers();
					} catch (e) {}
				} catch (e) {}
			} catch (e) {}
		};
		try {
			document.addEventListener("contextmenu", sidememoDocumentRightClickHandler, true);
		} catch (e) {}
	}
}
async function populateSidememoContainer(
	container: HTMLElement,
	protyleContent: HTMLElement,
): Promise<void> {
	const existingMemoEls = Array.from(
		protyleContent.querySelectorAll<HTMLElement>(
			'[data-type*="inline-memo"], [memo]',
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
			'[data-type*="inline-memo"], [memo]',
		),
	);
	type ItemWithTop = {
		el: HTMLElement;
		top: number;
		height: number;
		uid?: string;
		sourceEl?: HTMLElement;
		sourceEls?: HTMLElement[];
		index?: number;
		type: 'inline' | 'block' | 'file';
	};
	const items: ItemWithTop[] = [];
	const inlineMemoElements = memoElements.filter(memoEl =>
		memoEl.hasAttribute("data-type") &&
		memoEl.getAttribute("data-type")?.split(/\s+/).includes("inline-memo") &&
		!memoEl.closest(".av__gallery-content")
	);
	const processedInlineMemos = new Set<HTMLElement>();
	const mergedInlineMemos: Array<{elements: HTMLElement[], content: string}> = [];
	inlineMemoElements.forEach((memoEl, index) => {
		if (processedInlineMemos.has(memoEl)) return;
		const content = memoEl.getAttribute("data-inline-memo-content") || "";
		const group: HTMLElement[] = [memoEl];
		processedInlineMemos.add(memoEl);
		for (let i = index + 1; i < inlineMemoElements.length; i++) {
			const nextMemo = inlineMemoElements[i];
			if (processedInlineMemos.has(nextMemo)) continue;
			const nextContent = nextMemo.getAttribute("data-inline-memo-content") || "";
			if (content === nextContent && areConsecutiveSiblings(group[group.length - 1], nextMemo)) {
				group.push(nextMemo);
				processedInlineMemos.add(nextMemo);
			} else {
				break;
			}
		}
		mergedInlineMemos.push({ elements: group, content });
	});
	function isOnlyZeroWidthSpaces(text: string): boolean {
		if (!text) return true;
		const zeroWidthRegex = /^[\u200B\u200C\u200D\u200E\u200F\uFEFF]*$/;
		return zeroWidthRegex.test(text);
	}
	function areConsecutiveSiblings(el1: HTMLElement, el2: HTMLElement): boolean {
		if (!el1.parentElement || !el2.parentElement) return false;
		if (el1.parentElement !== el2.parentElement) return false;
		const siblings = Array.from(el1.parentElement.childNodes);
		const index1 = siblings.indexOf(el1);
		const index2 = siblings.indexOf(el2);
		if (index2 <= index1) return false;
		for (let i = index1 + 1; i < index2; i++) {
			const node = siblings[i];
			if (node.nodeType === Node.TEXT_NODE) {
				const textContent = node.textContent || "";
				if (!isOnlyZeroWidthSpaces(textContent)) {
					return false;
				}
			}
			if (node.nodeType === Node.ELEMENT_NODE) {
				return false;
			}
		}
		return true;
	}
	const blockMemoElements = memoElements.filter(memoEl => memoEl.hasAttribute("memo") && !memoEl.classList.contains("protyle-wysiwyg"));
	const fileMemoElements = memoElements.filter(memoEl => memoEl.hasAttribute("memo") && memoEl.classList.contains("protyle-wysiwyg"));
	const allMemoGroups: Array<any> = [...mergedInlineMemos, ...blockMemoElements, ...fileMemoElements];
	allMemoGroups.sort((a, b) => {
		let aNode: Node, bNode: Node;
		if ('elements' in a) {
			aNode = a.elements[0];
		} else {
			aNode = a;
		}
		if ('elements' in b) {
			bNode = b.elements[0];
		} else {
			bNode = b;
		}
		const position = aNode.compareDocumentPosition(bNode);
		if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
		if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
		return 0;
	});
	allMemoGroups.forEach((memoGroup, groupIndex) => {
		try {
			const isInlineMemoGroup = 'elements' in memoGroup;
			const isBlockMemo = memoGroup instanceof HTMLElement && memoGroup.hasAttribute("memo") && !memoGroup.classList.contains("protyle-wysiwyg");
			const isFileMemo = memoGroup instanceof HTMLElement && memoGroup.hasAttribute("memo") && memoGroup.classList.contains("protyle-wysiwyg");
			if (isInlineMemoGroup) {
				const { elements, content } = memoGroup as {elements: HTMLElement[], content: string};
				const titleText = elements.map(el => (el.textContent || "").trim()).join("");
				const item = document.createElement("div");
				item.className = "asri-enhance-sidememo-inlinememo-item";
				item.style.position = "absolute";
				const title = document.createElement("div");
				title.className = "asri-enhance-sidememo-inlinememo-item-title";
				title.textContent = titleText;
				const contentDiv = document.createElement("div");
				contentDiv.className = "asri-enhance-sidememo-inlinememo-item-content";
				try {
					const lute = getLute();
					const mdHtml = lute ? lute.Md2HTML(decodeHTML(content)) : content;
					contentDiv.innerHTML = mdHtml;
					try {
						applySyntaxHighlighting(contentDiv);
					} catch (e) {}
				} catch (e) {
					contentDiv.textContent = content;
				}
				item.appendChild(title);
				item.appendChild(contentDiv);
				try {
					if (elements.some(el => el.hasAttribute && el.hasAttribute("asri-enhance-sidememo-fold"))) {
						item.setAttribute("asri-enhance-sidememo-fold", "");
					}
				} catch (e) {}
				let uid = getUidFromElement(elements[0]);
				if (!uid) {
					uid = `${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
					try {
						elements.forEach(el => setUidToElement(el, uid!));
					} catch (e) {}
				}
				item.setAttribute("asri-enhance-sidememo-uid-" + uid, "");
				let top = 0;
				try {
					const firstMemoRect = elements[0].getBoundingClientRect();
					const titleRect = container.parentElement?.getBoundingClientRect();
					if (titleRect) {
						top = Math.max(0, firstMemoRect.top - titleRect.bottom + 4);
					} else {
						const protyleRect = protyleContent.getBoundingClientRect();
						top = Math.max(0, firstMemoRect.top - protyleRect.top);
					}
} catch (e) {}
				item.style.top = `${top}px`;
				items.push({ el: item, top, height: 0, uid, sourceEls: elements, index: groupIndex, type: 'inline' });
			} else if (isBlockMemo) {
				const memoEl = memoGroup as HTMLElement;
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
				const lute = getLute();
				const mdHtml = lute ? lute.Md2HTML(decodeHTML(contentText)) : contentText;
				content.innerHTML = mdHtml;
				try {
					applySyntaxHighlighting(content);
				} catch (e) {}
			} catch (e) {
				content.textContent = contentText;
			}
			item.appendChild(title);
			item.appendChild(content);
				try {
					if (memoEl.hasAttribute && memoEl.hasAttribute("asri-enhance-sidememo-fold")) {
						item.setAttribute("asri-enhance-sidememo-fold", "");
					}
				} catch (e) {}
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
				let uid = getUidFromElement(memoEl);
				if (!uid) {
					uid = `${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
					try {
						setUidToElement(memoEl, uid);
					} catch (e) {}
				}
				item.setAttribute("asri-enhance-sidememo-uid-" + uid, "");
				item.style.top = `${top}px`;
				items.push({ el: item, top, height: 0, uid, sourceEl: memoEl, index: groupIndex, type: 'block' });
			} else if (isFileMemo) {
				const memoEl = memoGroup as HTMLElement;
				let titleText = "";
				try {
					const prevSibling = memoEl.previousElementSibling;
					if (prevSibling && prevSibling.classList.contains("protyle-top")) {
						const titleInput = prevSibling.querySelector<HTMLElement>(".protyle-title .protyle-title__input");
						if (titleInput) {
							titleText = (titleInput.textContent || "").trim();
						}
					}
				} catch (e) {}
				if (!titleText) {
					titleText = (memoEl.textContent || "").trim();
				}
		const contentText = memoEl.getAttribute("memo") || "";
		const item = document.createElement("div");
		item.className = "asri-enhance-sidememo-filememo-item";
		item.style.position = "absolute";
		const title = document.createElement("div");
		title.className = "asri-enhance-sidememo-filememo-item-title";
		title.textContent = titleText;
		const content = document.createElement("div");
		content.className =
			"asri-enhance-sidememo-filememo-item-content";
		try {
			const lute = getLute();
			const mdHtml = lute ? lute.Md2HTML(decodeHTML(contentText)) : contentText;
			content.innerHTML = mdHtml;
			try {
				applySyntaxHighlighting(content);
			} catch (e) {}
		} catch (e) {
			content.textContent = contentText;
		}
		item.appendChild(title);
		item.appendChild(content);
				try {
					if (memoEl.hasAttribute && memoEl.hasAttribute("asri-enhance-sidememo-fold")) {
						item.setAttribute("asri-enhance-sidememo-fold", "");
					}
				} catch (e) {}
				let top = 20;
				let uid = getUidFromElement(memoEl);
				if (!uid) {
					uid = `${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
					try {
						setUidToElement(memoEl, uid);
					} catch (e) {}
				}
				item.setAttribute("asri-enhance-sidememo-uid-" + uid, "");
				item.style.top = `${top}px`;
				items.push({ el: item, top, height: 0, uid, sourceEl: memoEl, index: groupIndex, type: 'file' });
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
	let cursor = 0;
	items.forEach((it) => {
		const desiredTop = Math.max(0, it.top);
		const finalTop = Math.max(desiredTop, cursor);
		it.el.style.top = `${finalTop}px`;
		cursor = finalTop + it.height + GAP;
	});
	renderKatexInContainer(container);
	renderMermaidInContainer(container);
	renderEchartsInContainer(container);
	renderMindmapInContainer(container);
	renderAbcInContainer(container);
	await renderGraphvizInContainer(container);
	renderFlowchartInContainer(container);
	renderPlantumlInContainer(container);
	const toggleTooltipMemoNoneFor = (relatedEl: HTMLElement | null, add: boolean) => {
		try {
			if (!relatedEl) return;
			const isInlineMemo = relatedEl.hasAttribute && relatedEl.getAttribute("data-type") === "inline-memo";
			const isFileMemo = relatedEl.hasAttribute("memo") && relatedEl.classList.contains("protyle-wysiwyg");
			if (!isInlineMemo && !isFileMemo) return;
			if (add) {
				try {
					if (relatedEl.hasAttribute && relatedEl.hasAttribute("asri-enhance-sidememo-fold")) {
						return;
					}
				} catch (e) {}
			}
			const protyleWysiwyg = relatedEl.closest(".protyle-wysiwyg") as HTMLElement | null;
			if (!protyleWysiwyg) return;
			const prev = protyleWysiwyg.previousElementSibling as HTMLElement | null;
			if (!prev || !prev.classList || !prev.classList.contains("protyle-top")) return;
			if (prev.classList.contains("asri-enhance-sidememo-protyle-title-none")) return;
			const asriParent = protyleWysiwyg.closest(".asri-enhance-sidememo") as HTMLElement | null;
			if (!asriParent) return;
			const tooltip = document.querySelector(".tooltip--memo#tooltip") as HTMLElement | null;
			if (!tooltip) return;
			try {
				if (add) tooltip.classList.add("asri-enhance-sidememo-tooltip-memo-none");
				else tooltip.classList.remove("asri-enhance-sidememo-tooltip-memo-none");
			} catch (e) {}
		} catch (e) {}
	};
	items.forEach((it) => {
		try {
			const relatedEls = it.sourceEls || (it.sourceEl ? [it.sourceEl] : []);
			if (relatedEls.length === 0) return;
			const onItemEnter = () => {
				relatedEls.forEach(el => el.setAttribute("asri-enhance-sidememo-highlight", ""));
			};
			const onItemLeave = () => {
				relatedEls.forEach(el => el.removeAttribute("asri-enhance-sidememo-highlight"));
			};
			const onMemoEnter = () => {
				it.el.setAttribute("asri-enhance-sidememo-highlight", "");
				try {
					relatedEls.forEach(el => toggleTooltipMemoNoneFor(el, true));
				} catch (e) {}
			};
			const onMemoLeave = () => {
				it.el.removeAttribute("asri-enhance-sidememo-highlight");
				try {
					relatedEls.forEach(el => toggleTooltipMemoNoneFor(el, false));
				} catch (e) {}
			};
			it.el.addEventListener("mouseenter", onItemEnter);
			it.el.addEventListener("mouseleave", onItemLeave);
			relatedEls.forEach(related => {
				related.addEventListener("mouseenter", onMemoEnter);
				related.addEventListener("mouseleave", onMemoLeave);
			});
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
					const asriParent = relatedEls[0]?.closest(
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
						50,
						Math.min(600, Math.round(parseFloat(widthStr) || 200)),
					);
					let dragMove: ((ev: MouseEvent) => void) | null = null;
					let dragUp: (() => void) | null = null;
					let _rafId: number | null = null;
					let _pendingWidth: number | null = null;
					dragMove = (mv: MouseEvent) => {
						try {
							const computed = Math.round(
								initialWidth + (startX - mv.clientX),
							);
							const clamped = Math.max(50, Math.min(600, computed));
							_pendingWidth = clamped;
							if (_rafId === null) {
								_rafId = requestAnimationFrame(() => {
									try {
										if (_pendingWidth !== null) {
											asriParent.style.setProperty(
												"--asri-enhance-sidememo-container-width",
												`${_pendingWidth}px`,
											);
										}
									} catch (e) {}
									_rafId = null;
									_pendingWidth = null;
								});
							}
						} catch (e) {}
					};
					dragUp = () => {
						try {
							if (dragMove)
								document.removeEventListener("mousemove", dragMove);
							if (dragUp)
								document.removeEventListener("mouseup", dragUp);
						} catch (e) {}
						try {
							if (_rafId !== null) {
								cancelAnimationFrame(_rafId);
								_rafId = null;
								_pendingWidth = null;
							}
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
					try {
						setTimeout(() => {
							try {
								updateAllProtyleMemoClasses();
								ensureSidememoContainers();
							} catch (e) {}
						}, 200);
					} catch (e) {}
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
					".asri-enhance-sidememo-inlinememo-item-title, .asri-enhance-sidememo-blockmemo-item-title, .asri-enhance-sidememo-filememo-item-title",
				);
				if (titleEl) {
					const onTitleLeftClick = (ev: MouseEvent) => {
						try {
							ev.preventDefault();
							ev.stopPropagation();
						} catch (e) {}
						try {
							if (it.type === 'file') {
								const firstRelated = relatedEls[0];
								try {
									const prevSibling = firstRelated.previousElementSibling;
									if (prevSibling && prevSibling.classList.contains("protyle-top")) {
										const memoAttr = prevSibling.querySelector<HTMLElement>(".protyle-title .protyle-attr--memo");
										if (memoAttr) {
											const clickEvent = new MouseEvent("click", {
												bubbles: true,
												cancelable: true,
												view: window,
												button: 0,
											});
											memoAttr.dispatchEvent(clickEvent);
											return;
										}
									}
								} catch (e) {}
							}
							const firstRelated = relatedEls[0];
							const isMergedInlineMemo = relatedEls.length > 1;
							if (
								firstRelated?.hasAttribute &&
								firstRelated.hasAttribute("memo")
							) {
								let targetEl: HTMLElement | null = null;
								try {
									const protyleAttr = firstRelated.querySelector<HTMLElement>(":scope > .protyle-attr");
									if (protyleAttr) {
										targetEl = protyleAttr.querySelector<HTMLElement>(".protyle-attr--memo");
									}
								} catch (e) {
									targetEl = null;
								}
								const rect = (
									targetEl ?? firstRelated
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
										firstRelated.dispatchEvent(clickEvent);
									}
								} catch (e) {}
							} else if (isMergedInlineMemo) {
								showMergeMemoTip().catch(() => {});
							} else {
								const targetRect =
									firstRelated.getBoundingClientRect();
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
									firstRelated.dispatchEvent(ctxEvent);
								} catch (e) {}
							}
						} catch (e) {}
					};
					titleEl.addEventListener("click", onTitleLeftClick);
					const onTitleRightClick = (ev: MouseEvent) => {
						try {
							ev.preventDefault();
							ev.stopPropagation();
						} catch (e) {}
						try {
							const wasFolded = it.el.hasAttribute("asri-enhance-sidememo-fold");
							if (wasFolded) it.el.removeAttribute("asri-enhance-sidememo-fold");
							else it.el.setAttribute("asri-enhance-sidememo-fold", "");
							try {
								const uid = getUidFromElement(it.el);
								if (uid) {
									const selector = `[data-type*="inline-memo"][asri-enhance-sidememo-uid-${uid}], [memo][asri-enhance-sidememo-uid-${uid}]`;
									const sources = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
									sources.forEach(source => {
										if (source && source.setAttribute) {
											if (!wasFolded) source.setAttribute("asri-enhance-sidememo-fold", "");
											else {
												try {
													source.removeAttribute("asri-enhance-sidememo-fold");
												} catch (e) {}
											}
										}
									});
								}
							} catch (e) {}
						} catch (e) {}
						try {
							updateAllProtyleMemoClasses();
							ensureSidememoContainers();
						} catch (e) {}
					};
					titleEl.addEventListener("contextmenu", onTitleRightClick);
					const prev = (it.el as any).__asriSidememoHandlers || {};
					const merged = Object.assign(prev, {
						enter: onItemEnter,
						leave: onItemLeave,
						click: onTitleLeftClick,
						titleRightClick: onTitleRightClick,
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
				relatedEls.forEach(related => {
					(related as any).__asriSidememoHandlers = {
						enter: onMemoEnter,
						leave: onMemoLeave,
					};
				});
			} catch (e) {}
		} catch (e) {}
	});
}
let fetchInterceptorDisconnect: (() => void) | null = null;
export function removeAllSidememoArtifacts(): void {
	try {
		if (sidememoDocumentRightClickHandler) {
			try {
				document.removeEventListener("contextmenu", sidememoDocumentRightClickHandler, true);
			} catch (e) {}
			sidememoDocumentRightClickHandler = null;
		}
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
							if (handlers.titleRightClick) {
								try {
									const titleEl = child.querySelector(
										".asri-enhance-sidememo-inlinememo-item-title, .asri-enhance-sidememo-blockmemo-item-title, .asri-enhance-sidememo-filememo-item-title",
									) as HTMLElement | null;
									if (titleEl)
										titleEl.removeEventListener(
											"contextmenu",
											handlers.titleRightClick,
										);
								} catch (e) {}
							}
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
						'[data-type*="inline-memo"], [memo]',
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
							const uid = getUidFromElement(m);
							if (uid) {
								removeUidFromElement(m, uid);
							}
						} catch (e) {}
						try {
							m.removeAttribute("asri-enhance-sidememo-highlight");
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
		const titleElements = Array.from(
			document.querySelectorAll<HTMLElement>(".protyle-title"),
		);
		titleElements.forEach((titleEl) => {
			try {
				titleEl.style.removeProperty("--asri-enhance-sidememo-title-height");
			} catch (e) {}
		});
		const protyleTops = Array.from(
			document.querySelectorAll<HTMLElement>(".protyle-top"),
		);
		protyleTops.forEach((topEl) => {
			try {
				topEl.classList.remove("asri-enhance-sidememo-protyle-title-none");
			} catch (e) {}
		});
		const sidememoParents = Array.from(
			document.querySelectorAll<HTMLElement>(".asri-enhance-sidememo"),
		);
		sidememoParents.forEach((parentEl) => {
			try {
				parentEl.style.removeProperty("--asri-enhance-sidememo-container-width");
			} catch (e) {}
		});
		sidememoParents.forEach((parentEl) => {
			try {
				parentEl.classList.remove("asri-enhance-sidememo");
			} catch (e) {}
		});
		const allMemos = Array.from(
			document.querySelectorAll<HTMLElement>(
				'[data-type*="inline-memo"][asri-enhance-sidememo-fold], [memo][asri-enhance-sidememo-fold]',
			),
		);
		allMemos.forEach((memoEl) => {
			try {
				memoEl.removeAttribute("asri-enhance-sidememo-fold");
			} catch (e) {}
		});
		const tooltips = Array.from(
			document.querySelectorAll<HTMLElement>(".tooltip--memo#tooltip"),
		);
		tooltips.forEach((tooltip) => {
			try {
				tooltip.classList.remove("asri-enhance-sidememo-tooltip-memo-none");
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
			/setUILayout|transactions|setBlockAttrs|getDoc|renameDoc/,
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
	if (isMobile()) {
		return;
	}
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
		await initSidememoRely().catch(() => {});
		updateAllProtyleMemoClasses();
		startObserver().catch(() => {});
	}
	await saveData(plugin, CONFIG_FILE, config).catch(() => {});
}
export async function applySidememoConfig(
	plugin: Plugin,
	config?: Record<string, any> | null,
): Promise<void> {
	if (isMobile()) {
		return;
	}
	globalPlugin = plugin;
	const htmlEl = document.documentElement;
	if (!htmlEl) {
		return;
	}
	const configData =
		config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
	if (configData && configData[CONFIG_KEY] === true) {
		htmlEl.setAttribute("data-asri-enhance-side-memo", "true");
		await initSidememoRely().catch(() => {});
		updateAllProtyleMemoClasses();
		startObserver().catch(() => {});
	} else {
		htmlEl.removeAttribute("data-asri-enhance-side-memo");
		removeAllSidememoArtifacts();
		updateAllProtyleMemoClasses();
		stopObserver();
	}
}
