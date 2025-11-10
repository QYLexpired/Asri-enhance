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
}
