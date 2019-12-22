export function logoutController({ req }) {
  return Promise.resolve()
    .then(() => req.session.destroy())
    .then(() => ({}));
}
