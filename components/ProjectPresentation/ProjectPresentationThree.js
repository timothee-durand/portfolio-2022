import {
  Clock,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { Bounce, Elastic, gsap } from 'gsap'
import { random } from '~/utils/generative-utils.js'

export class ProjectPresentationThree {
  container
  isInScreen = false
  technos = []
  pointer = new Vector2(0, 0)
  raycaster = new Raycaster()
  font
  textGeometryParameters = {
    size: 2,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  }
  lastElapsedTime = 0
  isPointerOn = false

  possibleStartPositions = [
    new Vector3(-4, 4, 0),
    new Vector3(0, 3, -1),
    new Vector3(-4, -5, -1),
    new Vector3(2, -4, -3),
  ]
  possiblePositionIndex = 0

  constructor({ container, font }) {
    this.container = container
    this.textGeometryParameters.font = font
    this.technos = JSON.parse(this.container.dataset.techno)

    if (!this.technos) {
      console.error('There is no tech to print out !', this.container)
      return
    }
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.initThree()
    this.update()
    window.addEventListener('resize', () => this.onResize())
    this.container.addEventListener('pointermove', (e) => this.onPointerMove(e))
    this.container.addEventListener(
      'pointerenter',
      () => (this.isPointerOn = true)
    )
    this.container.addEventListener(
      'pointerleave',
      () => (this.isPointerOn = false)
    )

    this.shuffleArray(this.possibleStartPositions)
  }

  initThree() {
    this.scene = new Scene()
    this.clock = new Clock()

    this.addCamera()
    this.addRenderer()
    this.addBaseObject()
    //render once
    this.renderer.render(this.scene, this.camera)
  }

  addCamera() {
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
    this.camera.position.set(-2, -2, 10)
    this.scene.add(this.camera)
  }

  addRenderer() {
    this.renderer = new WebGLRenderer({
      antialias: true,
    })
    this.renderer.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight
    )
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.container.appendChild(this.renderer.domElement)
  }

  async addBaseObject() {
    const { TextGeometry } = await import(
      'three/examples/jsm/geometries/TextGeometry.js'
    )

    this.technos.forEach((tech) => {
      const position = this.getRandomPosition()
      if (!position) {
        return
      }
      const text = this.createTextGeometry(TextGeometry, tech)
      this.scene.add(text)
      text.position.copy(position)
      text.randomScale = random(0.7, 1, true)
      text.startingTime = random(10, 2000)
      text.speed = random(0.5, 4, true)
      text.scale.set(0, 0, 0)

      this.launchAnimation(text)
    })
    // console.log('---------')
  }

  getRandomPosition() {
    if (this.possiblePositionIndex >= this.possibleStartPositions.length - 1)
      return null
    const randomPos = this.possibleStartPositions[this.possiblePositionIndex]
    this.possiblePositionIndex++
    return randomPos
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  createTextGeometry(TextGeometry, text) {
    const textGeometry = new TextGeometry(text, this.textGeometryParameters)
    //center pivot point
    textGeometry.center()
    const textMaterial = new MeshNormalMaterial()
    const mesh = new Mesh(textGeometry, textMaterial)
    mesh.name = 'text'
    return mesh
  }

  update() {
    if (this.isInScreen) {
      // const elapsedTime = this.clock.getElapsedTime()
      // this.lastElapsedTime = elapsedTime
      // if(this.text) {
      //   this.text.position.y = this.text.startPosition.y - (Math.cos((elapsedTime + this.text.startingTime) * this.text.speed) * 0.01);
      //   this.text.position.x = this.text.startPosition.x + (Math.cos((elapsedTime + this.text.startingTime) * this.text.speed) * 0.01);
      //   this.text.rotation.y = this.text.startRotation.x - (Math.cos((elapsedTime + this.text.startingTime) * this.text.speed) * 0.1);
      // }
      if (this.isPointerOn) this.updateRaycaster()
      this.renderer.render(this.scene, this.camera)
    }
    window.requestAnimationFrame(() => this.update())
  }

  onResize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight
    )
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  /**
   * Keep the property by copying it and adding a prefix
   * @param {object} object
   * @param {string} property
   * @param {string} prefix
   */
  captureProperty(object, property = 'position', prefix = 'start') {
    if (!object[property]) {
      console.error(
        `Property ${property} does not exist on this object : `,
        object
      )
      return
    }
    object[
      `${prefix}${property.charAt(0).toUpperCase()}${property.slice(
        1,
        property.length
      )}`
    ] = object[property]
  }

  launchAnimation(text) {
    const animationProxy = {
      positionX: text.position.x,
      positionY: text.position.y,
      rotationY: text.rotation.y,
      positionZ: text.position.z,
    }
    // console.log(text)
    gsap.to(text.scale, {
      x: text.randomScale,
      y: text.randomScale,
      z: text.randomScale,
      duration: 0.5,
      ease: Bounce.easeOut,
    })

    gsap
      .timeline({ repeat: -1, yoyo: true, repeatDelay: random(0.1, 0.3, true) })
      .to(animationProxy, {
        positionX: animationProxy.positionX + random(0, 1, true),
        positionY: animationProxy.positionY + random(0, 1, true),
        // positionZ: animationProxy.positionZ + random(-0.000001, 0.000001, true),
        rotationY: animationProxy.rotationY + Math.PI / random(20, 40),
        duration: random(2, 4, true),
        ease: `slow(${random(0.5, 1, true)}, ${random(0.5, 1, true)}, true)`,
        onUpdate: () => {
          text.position.x = animationProxy.positionX
          text.position.y = animationProxy.positionY
          // text.position.z = animationProxy.positionZ;
          // text.rotation.y = animationProxy.rotationY
        },
      })
  }

  onPointerMove(e) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    const { left, top } = this.container.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top
    this.pointer.x = (x / this.container.offsetWidth) * 2 - 1
    this.pointer.y = -(y / this.container.offsetHeight) * 2 + 1
    this.isPointerOn = true
    //this.updateRaycaster();
  }

  updateRaycaster() {
    // update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera(this.pointer, this.camera)
    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.scene.children)

    //check the object that intersects
    for (let i = 0; i < intersects.length; i++) {
      const object = intersects[i].object
      if (object.name === 'text' && !object.isAnimating) {
        //if text not animated then animate it
        gsap.to(object.rotation, {
          onStart: () => {
            object.isAnimating = true
          },
          x: Math.PI * 2,
          duration: 2,
          ease: Elastic.easeOut,
          onComplete: () => {
            object.isAnimating = false
            object.rotation.x = 0
          },
        })
      }
    }
  }
}
