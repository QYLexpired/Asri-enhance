const ATTR_THEME_MODE = "data-theme-mode";
const ATTR_LIGHT_THEME = "data-light-theme";
const ATTR_DARK_THEME = "data-dark-theme";
const REQUIRED_THEME = "Asri";
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
export function removeAsriEnhanceEnable(): void {
  const html = document.documentElement;
  html.classList.remove("asri-enhance-enable");
}
