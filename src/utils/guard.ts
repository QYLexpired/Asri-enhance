const ATTR_THEME_MODE = "data-theme-mode";
const ATTR_LIGHT_THEME = "data-light-theme";
const ATTR_DARK_THEME = "data-dark-theme";
const REQUIRED_THEME = "Asri";
const RETRY_INTERVAL_MS = 50;
const MAX_RETRIES = 10;
export interface GuardResult {
  enabled: boolean;
  currentMode: string | null;
}
function addAsriEnhanceEnable(html: HTMLElement): void {
  const themeMode = html.getAttribute(ATTR_THEME_MODE);
  const lightTheme = html.getAttribute(ATTR_LIGHT_THEME);
  const darkTheme = html.getAttribute(ATTR_DARK_THEME);
  let shouldEnable = false;
  if (themeMode === "light" && lightTheme === REQUIRED_THEME) {
    shouldEnable = true;
  } else if (themeMode === "dark" && darkTheme === REQUIRED_THEME) {
    shouldEnable = true;
  }
  if (shouldEnable) {
    html.classList.add("asri-enhance-enable");
  } else {
    html.classList.remove("asri-enhance-enable");
  }
}
export function ThemeChangeObserver(): MutationObserver {
  const html = document.documentElement;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        const attrName = mutation.attributeName;
        if (
          attrName === ATTR_THEME_MODE ||
          attrName === ATTR_LIGHT_THEME ||
          attrName === ATTR_DARK_THEME
        ) {
          addAsriEnhanceEnable(html);
          break;
        }
      }
    }
  });
  observer.observe(html, {
    attributes: true,
    attributeFilter: [ATTR_THEME_MODE, ATTR_LIGHT_THEME, ATTR_DARK_THEME],
  });
  addAsriEnhanceEnable(html);
  return observer;
}
export function removeAsriEnhanceEnable(): void {
  const html = document.documentElement;
  html.classList.remove("asri-enhance-enable");
}
export async function checkAsriThemeGuard(): Promise<GuardResult> {
  const html = document.documentElement;
  const check = (): GuardResult => {
    const themeMode = html.getAttribute(ATTR_THEME_MODE);
    const lightTheme = html.getAttribute(ATTR_LIGHT_THEME);
    const darkTheme = html.getAttribute(ATTR_DARK_THEME);
    if (themeMode === "light") {
      return { enabled: lightTheme === REQUIRED_THEME, currentMode: "light" };
    }
    if (themeMode === "dark") {
      return { enabled: darkTheme === REQUIRED_THEME, currentMode: "dark" };
    }
    return { enabled: false, currentMode: themeMode };
  };
  const immediateResult = check();
  if (immediateResult.enabled || immediateResult.currentMode !== null) {
    return immediateResult;
  }
  for (let i = 1; i <= MAX_RETRIES; i++) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
    const result = check();
    if (result.enabled || result.currentMode !== null) {
      return result;
    }
  }
  return { enabled: false, currentMode: null };
}
