export function setThemeToHTML(themeParams: object) {
  const root = document.documentElement;

  Object.entries(themeParams).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
