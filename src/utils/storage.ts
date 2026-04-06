import { Plugin } from "siyuan";
export async function saveData(plugin: Plugin, fileName: string, data: Record<string, any>): Promise<void> {
    await plugin.saveData(fileName, data);
}
export async function loadData(plugin: Plugin, fileName: string): Promise<Record<string, any> | null> {
    if (!plugin.loadData) {
        return null;
    }
    try {
        return await plugin.loadData(fileName);
    }
    catch {
        return null;
    }
}
