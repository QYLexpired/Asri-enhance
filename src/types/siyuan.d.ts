declare module "siyuan" {
    export class Plugin {
        app?: unknown;
        isMobile?: boolean;
        token?: string;
        i18n?: Record<string, string>;
        constructor(options?: unknown);
        onload?(): Promise<void> | void;
        onLayoutReady?(): Promise<void> | void;
        onunload?(): Promise<void> | void;
        uninstall?(): Promise<void> | void;
        loadData?(name: string): Promise<any>;
        saveData?(name: string, data: any): Promise<void>;
        removeData?(name: string): Promise<void>;
    }
    export class Menu {
        constructor(id: string, onClose?: () => void);
        addItem(item: MenuItem): Menu;
        open(position: { x: number; y: number; }): void;
        close(): void;
        destroy(): void;
        element: HTMLElement;
    }
    export interface MenuItem {
        icon?: string;
        label?: string;
        click?: () => void;
        submenu?: MenuItem[];
        type?: "separator" | "text" | "button";
        accelerator?: string;
        id?: string;
        disabled?: boolean;
        iconClass?: string;
        iconHTML?: string;
        current?: boolean;
        action?: string;
        bind?: (element: HTMLElement) => void;
        element?: HTMLElement;
    }
    export function getFrontend(): string;
}
