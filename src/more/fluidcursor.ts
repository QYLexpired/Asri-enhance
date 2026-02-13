import { Plugin } from "siyuan";
import { saveData, loadData } from "../utils/storage";
const CONFIG_FILE = "config.json";
const CONFIG_KEY = "asri-enhance-fluidcursor";
const FLUID_CURSOR_CANVAS_ID = 'asri-enhance-fluid-cursor-canvas';
let animationFrameId: number | null = null;
let resizeHandler: (() => void) | null = null;
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
let mouseDownHandler: ((e: MouseEvent) => void) | null = null;
let mouseUpHandler: ((e: MouseEvent) => void) | null = null;
let mouseLeaveHandler: (() => void) | null = null;
let colorCheckInterval: number | null = null;
let points: { x: number; y: number }[] = [];
let mouse = { x: -100, y: -100 };
let lastTime = 0;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let isFirstMouseMove = true;
let cursorColor = '#f44336';
let lastMouseMoveTime = 0;
let hideCursorTimeout: number | null = null;
const MOUSE_IDLE_TIMEOUT = 200;
let isCursorVisible = false;
const FADE_DURATION = 300;
let isMouseDown = false;
const CONFIG = {
    trailLength: 8,
    widthBase: 6,
    widthFactor: 1.2,
    headEase: 0.9,
    tailStiffness: 0.4,
    zIndex: '999999',
    opacity: 1
};
const getCursorColor = () => {
    const computedStyle = getComputedStyle(document.documentElement);
    const color = computedStyle.getPropertyValue('--b3-theme-primary').trim();
    return color || '#f44336';
};
const randomCursorColor = () => {
    const baseColor = getCursorColor();
    const rand = Math.random();
    let randomHue: number;
    if (isMouseDown) {
        if (rand < 0.8) {
            randomHue = Math.floor(Math.random() * 61) + 180;
        } else {
            randomHue = Math.floor(Math.random() * 31) + 240;
        }
    } else {
        if (rand < 0.8) {
            randomHue = Math.floor(Math.random() * 61);
        } else {
            randomHue = Math.floor(Math.random() * 31) + 60;
        }
    }
    cursorColor = `oklch(from ${baseColor} l c calc(h + ${randomHue}))`;
};
const initFluidCursor = () => {
    const existingCanvas = document.getElementById(FLUID_CURSOR_CANVAS_ID);
    if (existingCanvas) {
        existingCanvas.remove();
    }
    canvas = document.createElement('canvas');
    canvas.id = FLUID_CURSOR_CANVAS_ID;
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        pointerEvents: 'none',
        zIndex: CONFIG.zIndex,
        opacity: '0'
    });
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    isMouseDown = false;
    randomCursorColor();
    mouse = { x: -100, y: -100 };
    points = [];
    isFirstMouseMove = true;
    isCursorVisible = false;
    const resize = () => {
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        if (ctx) {
            ctx.scale(dpr, dpr);
        }
    };
    resizeHandler = resize;
    resize();
    mouseMoveHandler = (e: MouseEvent) => {
        if (isFirstMouseMove) {
            isFirstMouseMove = false;
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            for (let i = 0; i < CONFIG.trailLength; i++) {
                points.push({ x: mouse.x, y: mouse.y });
            }
        } else {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
        randomCursorColor();
        lastMouseMoveTime = Date.now();
        if (!isCursorVisible && canvas) {
            isCursorVisible = true;
            canvas.style.transition = 'none';
            canvas.style.opacity = '1';
        }
        if (hideCursorTimeout !== null) {
            clearTimeout(hideCursorTimeout);
        }
        hideCursorTimeout = window.setTimeout(() => {
            isCursorVisible = false;
            if (canvas) {
                canvas.style.transition = `opacity ${FADE_DURATION}ms ease-out`;
                canvas.style.opacity = '0';
            }
        }, MOUSE_IDLE_TIMEOUT);
    };
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('mousemove', mouseMoveHandler, { passive: true });
    mouseDownHandler = () => {
        isMouseDown = true;
    };
    mouseUpHandler = () => {
        isMouseDown = false;
        cursorColor = getCursorColor();
    };
    window.addEventListener('mousedown', mouseDownHandler, { passive: true });
    window.addEventListener('mouseup', mouseUpHandler, { passive: true });
    mouseLeaveHandler = () => {
        points = [];
        isFirstMouseMove = true;
    };
    document.addEventListener('mouseleave', mouseLeaveHandler);
    const animate = (currentTime: number) => {
        if (!canvas || !ctx) return;
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        const timeFactor = deltaTime * 60;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (isFirstMouseMove) {
            animationFrameId = window.requestAnimationFrame(animate);
            return;
        }
        const actualHeadEase = 1 - Math.pow(1 - CONFIG.headEase, timeFactor);
        const actualTailEase = 1 - Math.pow(1 - CONFIG.tailStiffness, timeFactor);
        points[0].x += (mouse.x - points[0].x) * actualHeadEase;
        points[0].y += (mouse.y - points[0].y) * actualHeadEase;
        for (let i = 1; i < points.length; i++) {
            points[i].x += (points[i - 1].x - points[i].x) * actualTailEase;
            points[i].y += (points[i - 1].y - points[i].y) * actualTailEase;
        }
        ctx.strokeStyle = cursorColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 0; i < points.length - 1; i++) {
            const width = Math.max(0, CONFIG.widthBase - (i * CONFIG.widthFactor));
            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[i + 1].x, points[i + 1].y);
            ctx.stroke();
        }
        animationFrameId = window.requestAnimationFrame(animate);
    };
    lastTime = performance.now();
    animationFrameId = window.requestAnimationFrame(animate);
    colorCheckInterval = window.setInterval(randomCursorColor, 3000);
};
const destroyFluidCursor = () => {
    const existingCanvas = document.getElementById(FLUID_CURSOR_CANVAS_ID);
    if (existingCanvas) {
        existingCanvas.remove();
    }
    if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    if (colorCheckInterval !== null) {
        window.clearInterval(colorCheckInterval);
        colorCheckInterval = null;
    }
    if (hideCursorTimeout !== null) {
        clearTimeout(hideCursorTimeout);
        hideCursorTimeout = null;
    }
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }
    if (mouseMoveHandler) {
        window.removeEventListener('mousemove', mouseMoveHandler);
        mouseMoveHandler = null;
    }
    if (mouseDownHandler) {
        window.removeEventListener('mousedown', mouseDownHandler);
        mouseDownHandler = null;
    }
    if (mouseUpHandler) {
        window.removeEventListener('mouseup', mouseUpHandler);
        mouseUpHandler = null;
    }
    if (mouseLeaveHandler) {
        document.removeEventListener('mouseleave', mouseLeaveHandler);
        mouseLeaveHandler = null;
    }
    points = [];
    mouse = { x: 0, y: 0 };
    lastTime = 0;
    canvas = null;
    ctx = null;
};
export { destroyFluidCursor };
export async function onFluidCursorClick(plugin: Plugin, event?: MouseEvent): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const isActive = htmlEl.hasAttribute("data-asri-enhance-fluidcursor");
    const config = await loadData(plugin, CONFIG_FILE) || {};
    if (isActive) {
        htmlEl.removeAttribute("data-asri-enhance-fluidcursor");
        config[CONFIG_KEY] = false;
        destroyFluidCursor();
    }
    else {
        htmlEl.setAttribute("data-asri-enhance-fluidcursor", "true");
        config[CONFIG_KEY] = true;
        initFluidCursor();
    }
    await saveData(plugin, CONFIG_FILE, config).catch(() => {
    });
}
export async function applyFluidCursorConfig(plugin: Plugin, config?: Record<string, any> | null): Promise<void> {
    const htmlEl = document.documentElement;
    if (!htmlEl) {
        return;
    }
    const configData = config !== undefined ? config : await loadData(plugin, CONFIG_FILE);
    if (configData && configData[CONFIG_KEY] === true) {
        htmlEl.setAttribute("data-asri-enhance-fluidcursor", "true");
        initFluidCursor();
    }
    else {
        htmlEl.removeAttribute("data-asri-enhance-fluidcursor");
        destroyFluidCursor();
    }
}
