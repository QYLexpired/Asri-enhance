export type DisconnectFn = () => void;
const interceptorRegistry: {
    pattern: RegExp;
    callback: (url: string, options?: any) => void;
}[] = [];
let originalFetch: any = (window as any).fetch;
let isPatched = false;
function ensurePatched() {
    if (isPatched) {
        return;
    }
    const prev = originalFetch;
    const patched: any = new Proxy(prev, {
        apply(target, thisArg, args: any[]) {
            try {
                const [url, options] = args;
                const urlStr = url instanceof URL ? url.href : String(url);
                let bodyStr: string | null = null;
                try {
                    if (options && typeof options === "object") {
                        const b = (options as any).body;
                        if (typeof b === "string") {
                            bodyStr = b;
                        }
                        else if (b instanceof URLSearchParams) {
                            bodyStr = b.toString();
                        }
                        else if (b && typeof b === "object") {
                            try {
                                bodyStr = JSON.stringify(b);
                            }
                            catch (e) {
                                bodyStr = null;
                            }
                        }
                    }
                }
                catch (e) {
                    bodyStr = null;
                }
                interceptorRegistry.forEach((entry) => {
                    try {
                        const matchedUrl = entry.pattern.test(urlStr);
                        const matchedBody = bodyStr ? entry.pattern.test(bodyStr) : false;
                        if (matchedUrl || matchedBody) {
                            queueMicrotask(() => {
                                try {
                                    entry.callback(urlStr, options);
                                }
                                catch (err) { }
                            });
                        }
                    }
                    catch (err) { }
                });
            }
            catch (err) { }
            return Reflect.apply(prev, thisArg, args);
        },
    });
    try {
        (window as any).fetch = patched;
        isPatched = true;
    }
    catch (err) {
    }
    try {
        const OriginalXHROpen = XMLHttpRequest.prototype.open;
        const OriginalXHRSend = XMLHttpRequest.prototype.send;
        (XMLHttpRequest.prototype as any).open = function (method: string, url?: string | URL | null, async?: boolean, user?: string | null, password?: string | null) {
            try {
                (this as any).__asri_intercept_url = url instanceof URL ? url.href : String(url);
            }
            catch (e) { }
            return OriginalXHROpen.apply(this, arguments as any);
        };
        (XMLHttpRequest.prototype as any).send = function (body?: Document | BodyInit | null) {
            try {
                const urlStr = (this as any).__asri_intercept_url || "";
                let bodyStr: string | null = null;
                try {
                    if (typeof body === "string") {
                        bodyStr = body;
                    }
                    else if (body instanceof URLSearchParams) {
                        bodyStr = body.toString();
                    }
                    else if (body && typeof body === "object") {
                        try {
                            bodyStr = JSON.stringify(body);
                        }
                        catch (e) {
                            bodyStr = null;
                        }
                    }
                }
                catch (e) {
                    bodyStr = null;
                }
                if (urlStr || bodyStr) {
                    interceptorRegistry.forEach((entry) => {
                        try {
                            const matchedUrl = urlStr ? entry.pattern.test(urlStr) : false;
                            const matchedBody = bodyStr ? entry.pattern.test(bodyStr) : false;
                            if (matchedUrl || matchedBody) {
                                queueMicrotask(() => {
                                    try {
                                        entry.callback(urlStr, body);
                                    }
                                    catch (err) { }
                                });
                            }
                        }
                        catch (err) { }
                    });
                }
            }
            catch (e) { }
            return OriginalXHRSend.apply(this, arguments as any);
        };
    }
    catch (err) {
    }
}
export function createFetchInterceptor(urlPattern: string | RegExp, callback: (url: string, options?: any) => void) {
    const pattern = urlPattern instanceof RegExp ? urlPattern : new RegExp(String(urlPattern));
    const entry = { pattern, callback };
    interceptorRegistry.push(entry);
    ensurePatched();
    const disconnect = () => {
        const idx = interceptorRegistry.indexOf(entry);
        if (idx !== -1) {
            interceptorRegistry.splice(idx, 1);
        }
        if (interceptorRegistry.length === 0 && isPatched) {
            try {
                (window as any).fetch = originalFetch;
            }
            catch (err) { }
            isPatched = false;
        }
    };
    return { disconnect };
}
