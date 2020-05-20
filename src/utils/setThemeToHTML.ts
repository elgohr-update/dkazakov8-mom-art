export function setThemeToHTML(themeParams: Record<string, any>) {
  const root = document.documentElement;

  Object.entries(themeParams).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
