import { ProjectPresentationThree } from '~/components/ProjectPresentation/ProjectPresentationThree.js'

export default class ProjectPresentationMaster {
  height
  width
  elements = []

  constructor({ container, elements }) {
    this.container = container
    this.elements = [...elements]
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.initObserver()
    this.initScenes()
  }

  async initScenes() {
    const font = await this.loadFacetype()

    const SVGObject = await import("three/examples/jsm/renderers/SVGRenderer.js")
    const OrbitController = await import("three/examples/jsm/controls/OrbitControls.js")
    const { TextGeometry } = await import("three/examples/jsm/geometries/TextGeometry.js");

    this.elements.forEach((e) => {
      e.projectPresentation = new ProjectPresentationThree({
        container: e,
        font,
        dependencies : {
          svgObject : SVGObject,
          controls : OrbitController,
          textGeometry : TextGeometry
        }
      })
      // this.projectPresentations.push(new ProjectPresentation({ container: e }));
      this.observer.observe(e)
    })
  }

  initObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
    }

    this.observer = new IntersectionObserver(
      (e) => this.onIntersection(e),
      options
    )
  }

  onIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        entry.target.projectPresentation.isInScreen = true
        return
      }

      entry.target.projectPresentation.isInScreen = false
    })
  }

  loadFacetype() {
    return new Promise(async (resolve) => {
      const { FontLoader } = await import(
        'three/examples/jsm/loaders/FontLoader.js'
      )
      const fontLoader = new FontLoader()
      fontLoader.load(
        '/facetypes/commune_nuit_debout.typeface.json.json',
        (font) => {
          resolve(font)
        }
      )
    })
  }
}
