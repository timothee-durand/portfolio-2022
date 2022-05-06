export default function ({ app }) {
  app.router.afterEach(() => {
    window.scrollTo({ x: 0, y: 0 })
  })
}
