<template>
  <canvas ref="three-container" class="image" />
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
  WebGLRenderer, Vector4, Vector2, DoubleSide
} from "three";
import imageFrag from '~/assets/shaders/image-fragment.frag'
import imageVert from '~/assets/shaders/image-vert.vert'
export default {
  name: "my-image",
  mounted() {
    this.container = this.$refs["three-container"];
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.initThree();
  },
  data() {
    return {
      pointer: new Vector2(0, 0)
    };
  },
  props: {
    imageUrl: {
      type: String,
      required: true
    }
  },
  methods: {
    async initThree() {
      await this.loadTexture();
      this.scene = new Scene();
      this.clock = new Clock();

      this.camera = new PerspectiveCamera(60, this.width / this.height, 0.1, 1000);

      this.scene.add(this.camera);

      this.renderer = new WebGLRenderer({
        antialias: true,
        canvas: this.$refs["three-container"]
      });
      this.renderer.setSize(
        this.width,
        this.height
      );
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


      // const {OrbitControls} = await import("three/examples/jsm/controls/OrbitControls.js")
      // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.camera.position.set(0, 0, 5);
      this.$parent.$el.addEventListener("mousemove", (e) => this.onPointerMove(e));
      window.addEventListener("resize", () => this.onResize());

      this.addImage();

      this.light = new AmbientLight("white", 2);
      this.scene.add(this.light);

      this.update();
     // console.log(this.scene);
    },
    loadTexture() {
      this.textureLoader = new TextureLoader();
      return new Promise((resolve => {
        this.textureLoader.load(this.imageUrl, (texture) => {
          this.texture = texture
          this.updateDimensions()
          resolve();
        });
      }));
    },
    updateDimensions() {
      this.width = this.container.offsetWidth;
      this.ratio = this.texture.image.naturalHeight / this.texture.image.naturalWidth;
      this.height = this.ratio * this.width
   //   console.log(this.width, this.height);
    },
    onPointerMove(e) {
      if (this.isPhone) return;
      // calculate pointer position in normalized device coordinates
      // (-1 to +1) for both components
      const { left, top } = this.container.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      this.pointer.x = (x / this.container.offsetWidth);
      this.pointer.y = 1-(y / this.container.offsetHeight);
      //this.updateRaycaster();
    },
    onResize() {
      // Update sizes
      this.updateDimensions()

      // Update camera
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    },
    update() {
      if(this.plane) this.plane.material.uniforms.uMouse.value = this.pointer
      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(() => this.update());
    },
    addImage() {

      // this.scene.add(
      //   new Mesh(
      //     new BoxGeometry(1, 1, 1),
      //     new MeshNormalMaterial()
      //   )
      // )


      this.plane = new Mesh(
        new PlaneGeometry(11, this.ratio *11),
        new ShaderMaterial({
          extensions: {
            derivatives: "#extension GL_OES_standard_derivatives : enable"
          },
          side: DoubleSide,
          uniforms: {
            "tDiffuse": { value: this.texture },
            "resolution": { value: new Vector2(1.,window.innerHeight/window.innerWidth) },
            "uMouse": { value:  this.pointer},
            "uVelo": { value: -10 },
          },
          // wireframe: true,
          transparent: true,
          vertexShader: imageVert,
          fragmentShader: imageFrag
        })
      );
      this.scene.add(this.plane);
    }
  }
};
</script>

<style scoped>
.image {
  width: 100%;
  height: 30rem;
}
</style>
