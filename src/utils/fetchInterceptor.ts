export type DisconnectFn = () => void;
const interceptorRegistry: {
    pattern: RegExp;
    callback: (url: string, options?: any) => void;
}[] = [];
let patchedFetch: ((this: any, input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) | null = null;
let downstreamFetch: typeof window.fetch | null = null;
function installPatch(): void {
    if (patchedFetch) return;
    downstreamFetch = window.fetch.bind(window);
    const patched = async function (this: any, input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        try {
            const urlStr = input instanceof URL ? input.href : String(input);
            let bodyStr: string | null = null;
            try {
                if (init && typeof init === "object") {
                    const b = (init as any).body;
                    if (typeof b === "string") {
                        bodyStr = b;
                    } else if (b instanceof URLSearchParams) {
                        bodyStr = b.toString();
                    } else if (b && typeof b === "object") {
                        try {
                            bodyStr = JSON.stringify(b);
                        } catch (e) {
                            bodyStr = null;
                        }
                    }
                }
            } catch (e) {
                bodyStr = null;
            }
            const entries = interceptorRegistry.slice();
            for (const entry of entries) {
                try {
                    const matchedUrl = entry.pattern.test(urlStr);
                    const matchedBody = bodyStr ? entry.pattern.test(bodyStr) : false;
                    if (matchedUrl || matchedBody) {
                        queueMicrotask(() => {
                            try {
                                entry.callback(urlStr, init);
                            } catch (err) {
                            }
                        });
                    }
                } catch (err) {
                }
            }
        } catch (err) {
        }
        return downstreamFetch!.call(this, input, init as any);
    };
    patchedFetch = patched as any;
    window.fetch = patchedFetch as typeof window.fetch;
}
function uninstallPatch(): void {
    if (!patchedFetch) return;
    if ((window.fetch as unknown) === patchedFetch) {
        window.fetch = downstreamFetch!;
    }
    patchedFetch = null;
    downstreamFetch = null;
}
const XHR_MARKER = "__asri_patched";
function xhrInterceptorActive(): boolean {
    return (XMLHttpRequest.prototype as any).open !== XMLHttpRequest.prototype.open &&
        (XMLHttpRequest.prototype as any).__asri_marker === XHR_MARKER;
}
function installXHRPatch(): void {
    if (xhrInterceptorActive()) return;
    const OriginalOpen = XMLHttpRequest.prototype.open;
    const OriginalSend = XMLHttpRequest.prototype.send;
    (XMLHttpRequest.prototype as any).open = function (
        method: string,
        url?: string | URL | null,
        async?: boolean,
        user?: string | null,
        password?: string | null,
    ) {
        try {
            (this as any).__asri_intercept_url =
                url instanceof URL ? url.href : String(url ?? "");
        } catch (e) {
        }
        return OriginalOpen.apply(this, arguments as any);
    };
    (XMLHttpRequest.prototype as any).send = function (body?: Document | BodyInit | null) {
        try {
            const urlStr = (this as any).__asri_intercept_url || "";
            let bodyStr: string | null = null;
            try {
                if (typeof body === "string") {
                    bodyStr = body;
                } else if (body instanceof URLSearchParams) {
                    bodyStr = body.toString();
                } else if (body && typeof body === "object") {
                    try {
                        bodyStr = JSON.stringify(body);
                    } catch (e) {
                        bodyStr = null;
                    }
                }
            } catch (e) {
                bodyStr = null;
            }
            if (urlStr || bodyStr) {
                const entries = interceptorRegistry.slice();
                for (const entry of entries) {
                    try {
                        const matchedUrl = urlStr ? entry.pattern.test(urlStr) : false;
                        const matchedBody = bodyStr ? entry.pattern.test(bodyStr) : false;
                        if (matchedUrl || matchedBody) {
                            queueMicrotask(() => {
                                try {
                                    entry.callback(urlStr, body);
                                } catch (err) {
                                }
                            });
                        }
                    } catch (err) {
                    }
                }
            }
        } catch (e) {
        }
        return OriginalSend.apply(this, arguments as any);
    };
    (XMLHttpRequest.prototype as any).__asri_marker = XHR_MARKER;
}
function uninstallXHRPatch(): void {
    if (!xhrInterceptorActive()) return;
    if ((XMLHttpRequest.prototype as any).__asri_marker === XHR_MARKER) {
        delete (XMLHttpRequest.prototype as any).__asri_marker;
        delete (XMLHttpRequest.prototype as any).__asri_intercept_url;
    }
}
export function createFetchInterceptor(
    urlPattern: string | RegExp,
    callback: (url: string, options?: any) => void,
): { disconnect: DisconnectFn } {
    const pattern = urlPattern instanceof RegExp ? urlPattern : new RegExp(String(urlPattern));
    const entry = { pattern, callback };
    interceptorRegistry.push(entry);
    if (interceptorRegistry.length === 1) {
        installPatch();
        installXHRPatch();
    }
    const disconnect = () => {
        const idx = interceptorRegistry.indexOf(entry);
        if (idx !== -1) {
            interceptorRegistry.splice(idx, 1);
        }
        if (interceptorRegistry.length === 0) {
            uninstallPatch();
            uninstallXHRPatch();
        }
    };
    return { disconnect };
}