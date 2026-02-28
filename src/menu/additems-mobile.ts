import { getFrontend, Menu, Plugin } from "siyuan";
const isMobile = () => {
    return getFrontend().endsWith('mobile');
};
async function getConfig() {
    const response = await fetch('/api/system/getConf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data.data.conf;
}
async function getCurrentThemeMode(): Promise<number> {
    const config = await getConfig();
    if (config.appearance.modeOS) {
        return 2;
    }
    return config.appearance.mode || 0;
}
function updateBarModeIcon(svg: SVGSVGElement, mode: number) {
    let iconId = "#iconLight";
    if (mode === 1) {
        iconId = "#iconDark";
    } else if (mode === 2) {
        iconId = "#iconMode";
    }
    svg.innerHTML = `<use xlink:href="${iconId}"></use>`;
}
async function setModeOS(enable: boolean) {
    const config = await getConfig();
    await fetch('/api/setting/setAppearance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...config.appearance,
            modeOS: enable
        })
    });
}
const setThemeMode = async (mode: number) => {
    if (mode === 2) {
        await setModeOS(true);
    } else {
        await setModeOS(false);
        await fetch('/api/system/setAppearanceMode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mode: mode
            })
        });
    }
    const barModeSvg = document.querySelector<SVGSVGElement>("#barMode");
    if (barModeSvg) {
        updateBarModeIcon(barModeSvg, mode);
    }
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
    svg.setAttribute("class", "toolbar__icon toolbar__item asri-enhance-mobilemenu-btn");
    svg.setAttribute("width", "1em");
    svg.setAttribute("height", "1em");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    getCurrentThemeMode().then(mode => {
        updateBarModeIcon(svg, mode);
    });
    svg.addEventListener("click", (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const menu = new Menu("barmode", () => {
        });
        menu.element.classList.add("asri-enhance-mobilemenu");
        menu.addItem({
            icon: "iconLight",
            label: plugin.i18n?.light || "Light",
            click: () => {
                setThemeMode(0);
            },
        });
        menu.addItem({
            icon: "iconDark",
            label: plugin.i18n?.dark || "Dark",
            click: () => {
                setThemeMode(1);
            },
        });
        menu.addItem({
            icon: "iconMode",
            label: plugin.i18n?.followSystem || "Follow System",
            click: () => {
                setThemeMode(2);
            },
        });
        menu.open({
            x: e.clientX,
            y: e.clientY + 20
        });
    });
    toolbarName.after(svg);
}
