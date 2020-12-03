export function logout({ req }) {
  return Promise.resolve()
    .then(() => req.session.destroy())
    .then(() => ({}));
}
