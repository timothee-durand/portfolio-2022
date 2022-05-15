<template>
  <canvas
    ref="three-container"
    class="image"
    :style="{ aspectRatio: `${naturalWidth} / ${naturalHeight}` }"
  />
</template>
<script>
import {
  AmbientLight,
  Clock,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  TextureLoader,
  ShaderMaterial,
  WebGLRenderer,
  Vector4,
  Vector2,
  DoubleSide,
} from 'three'
import imageFrag from '~/assets/shaders/image-fragment.frag'
import imageVert from '~/assets/shaders/image-vert.vert'
import { random } from 'gsap/gsap-core'
export default {
  name: 'my-image',
  async mounted() {
    this.container = this.$refs['three-container']
    await this.initThree()
  },
  data() {
    return {
      pointer: new Vector2(0, 0),
      ratio: 0,
      naturalWidth: 100,
      naturalHeight: 100,
    }
  },
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
  },
  methods: {
    async initThree() {
      await this.loadTexture()
      this.scene = new Scene()
      this.clock = new Clock()


      this.camera = new PerspectiveCamera(
        60,
        this.height / this.width,
        0.1,
        1000
      )

      this.scene.add(this.camera)

      this.renderer = new WebGLRenderer({
        antialias: true,
        canvas: this.$refs['three-container'],
      })

      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.renderer.setSize(this.width, this.height, false)

      // const {OrbitControls} = await import("three/examples/jsm/controls/OrbitControls.js")
      // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.camera.position.set(0, 0, 5)
      this.$parent.$el.addEventListener('mousemove', (e) =>
        this.onPointerMove(e)
      )
      window.addEventListener('resize', () => this.onResize())

      this.addImage()

      this.light = new AmbientLight('white', 2)
      this.scene.add(this.light)

      this.update()
    },
    loadTexture() {
      this.textureLoader = new TextureLoader()
      return new Promise((resolve) => {
        this.textureLoader.load(this.imageUrl, (texture) => {
          this.texture = texture
          const image = this.texture.image
          this.naturalHeight = image.naturalHeight
          this.naturalWidth = image.naturalWidth
          this.ratio = this.naturalHeight / this.naturalWidth
          this.updateDimensions()
          resolve()
        })
      })
    },
    updateDimensions() {
      this.width = this.container.clientWidth
      this.height = this.container.clientWidth * this.ratio
    },
    onPointerMove(e) {
      if (this.isPhone) return
      // calculate pointer position in normalized device coordinates
      // (-1 to +1) for both components
      const { left, top } = this.container.getBoundingClientRect()
      const x = e.clientX - left
      const y = e.clientY - top
      this.pointer.x = x / this.container.offsetWidth
      this.pointer.y = 1 - y / this.container.offsetHeight
      //this.updateRaycaster();
    },
    onResize() {
      this.updateDimensions()
      // Update camera
      this.camera.aspect = this.height / this.width
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(this.width, this.height, false)

      // Update renderer
      // this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    },
    update() {
      if (this.plane) this.plane.material.uniforms.uMouse.value = this.pointer
      if (this.controls) this.controls.update()
      this.renderer.render(this.scene, this.camera)
      window.requestAnimationFrame(() => this.update())
    },
    addImage() {
      this.plane = new Mesh(
        new PlaneGeometry(this.ratio * 6, 6),
        new ShaderMaterial({
          extensions: {
            derivatives: '#extension GL_OES_standard_derivatives : enable',
          },
          side: DoubleSide,
          uniforms: {
            tDiffuse: { value: this.texture },
            resolution: { value: new Vector2(1, this.height / this.width) },
            uMouse: { value: this.pointer },
            uVelo: { value: -5 },
          },
          // wireframe: true,
          transparent: true,
          vertexShader: imageVert,
          fragmentShader: imageFrag,
        })
      )
      this.scene.add(this.plane)
    },
  },
}
</script>

<style scoped>
.image {
  width: 100%;
}
</style>
