import { getFrontend, Menu, Plugin } from "siyuan";
const isMobile = () => {
    return getFrontend().endsWith('mobile');
};
export function addMobileBarModeBtn(plugin: Plugin): void {
    if (!isMobile()) {
        return;
    }
    const toolbarName = document.querySelector<HTMLElement>("#toolbarName");
    if (!toolbarName) {
        return;
    }
    if (document.querySelector("#barMode")) {
        return;
    }
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "barMode";
    svg.setAttribute("class", "toolbar__icon toolbar__item");
    svg.setAttribute("width", "1em");
    svg.setAttribute("height", "1em");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.innerHTML = `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0V5a2 2 0 0 0-2-2"></path><path d="m13 7.35l-2-2a2 2 0 0 0-2.828 0L5.344 8.178a2 2 0 0 0 0 2.828l9 9"></path><path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12m0-4v.01"></path></g>`;
    svg.addEventListener("click", (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const menu = new Menu("barmode", () => {
        });
        menu.element.classList.add("asri-enhance-mobilemenu");
        menu.addItem({
            icon: "#iconLight",
            label: "asri-enhance-placeholder",
            click: () => {
            },
            bind: (element: HTMLElement) => {
                element.classList.add("fn__none", "asri-enhance-placeholder");
            }
        });
        menu.open({
            x: e.clientX,
            y: e.clientY + 20
        });
    });
    toolbarName.after(svg);
}
