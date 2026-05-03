const ATTR_THEME_MODE = "data-theme-mode";
const ATTR_LIGHT_THEME = "data-light-theme";
const ATTR_DARK_THEME = "data-dark-theme";
const REQUIRED_THEMES = {
  asri: "Asri",
  neo: "Neo",
};
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
function addAsriEnhanceEnable(html: HTMLElement): void {
  const themeMode = html.getAttribute(ATTR_THEME_MODE);
  const lightTheme = html.getAttribute(ATTR_LIGHT_THEME);
  const darkTheme = html.getAttribute(ATTR_DARK_THEME);
  removeAllEnhanceEnableClasses(html);
  if (themeMode === "light" && lightTheme === REQUIRED_THEMES.asri) {
    html.classList.add("asri-enhance-enable");
  } else if (themeMode === "dark" && darkTheme === REQUIRED_THEMES.asri) {
    html.classList.add("asri-enhance-enable");
  } else if (themeMode === "light" && lightTheme === REQUIRED_THEMES.neo) {
    html.classList.add("asri-enhance-enable-neo");
  } else if (themeMode === "dark" && darkTheme === REQUIRED_THEMES.neo) {
    html.classList.add("asri-enhance-enable-neo");
  }
}
function removeAllEnhanceEnableClasses(html: HTMLElement): void {
  html.classList.remove("asri-enhance-enable");
  html.classList.remove("asri-enhance-enable-neo");
}
export type ThemeType = "asri" | "neo" | "other";
export function getCurrentThemeType(): ThemeType {
  const html = document.documentElement;
  const themeMode = html.getAttribute(ATTR_THEME_MODE);
  const lightTheme = html.getAttribute(ATTR_LIGHT_THEME);
  const darkTheme = html.getAttribute(ATTR_DARK_THEME);
  if (themeMode === "light" && lightTheme === REQUIRED_THEMES.asri) {
    return "asri";
  } else if (themeMode === "dark" && darkTheme === REQUIRED_THEMES.asri) {
    return "asri";
  } else if (themeMode === "light" && lightTheme === REQUIRED_THEMES.neo) {
    return "neo";
  } else if (themeMode === "dark" && darkTheme === REQUIRED_THEMES.neo) {
    return "neo";
  }
  return "other";
}
export function removeAsriEnhanceEnable(): void {
  const html = document.documentElement;
  removeAllEnhanceEnableClasses(html);
}
