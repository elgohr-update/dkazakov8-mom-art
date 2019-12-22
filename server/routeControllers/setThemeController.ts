export function setThemeController({ req }) {
  const { theme } = req.body;

  return Promise.resolve().then(() => {
    req.session.theme = theme;

    return {};
  });
}
