<template>
  <div ref="canvas" class="project-header" />
</template>
<script>
import {
  AmbientLight,
  Clock,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Mesh,
  BoxGeometry,
  TextureLoader,
  WebGLRenderer
} from "three";


export default {
  name: "ProjectHeader",
  mounted() {
    this.width = this.$refs.canvas.offsetWidth;
    this.height = this.$refs.canvas.offsetHeight;
    this.initThree();
    this.addModels();
    this.update();
  },
  methods: {
    initThree() {
      this.scene = new Scene();
      this.clock = new Clock();

      this.camera = new PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
      this.camera.position.set(0, 2, 5);
      this.scene.add(this.camera);

      this.renderer = new WebGLRenderer({
        antialias: true,
        alpha: true
      });
      this.renderer.setSize(
        this.width,
        this.height
      );
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.$refs.canvas.appendChild(this.renderer.domElement);

      this.ambiantLight = new AmbientLight(0xffffff, 2);
      this.scene.add(this.ambiantLight);


    },
    update() {
      this.renderer.render(this.scene, this.camera);

      window.requestAnimationFrame(() => this.update());
    },
    async addModels() {
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);
      const texture = new TextureLoader().load("image.jpg");

      // const box = new Mesh(
      //   new BoxGeometry(1, 1, 1),
      //   new MeshStandardMaterial({
      //     map : texture
      //   })
      // )
      // this.scene.add(box)

      // Load a glTF resource
      loader.load(
        // resource URL
        "models/macbook.gltf",
        // called when the resource is loaded
        (gltf) => {
          this.scene.add(gltf.scene);
          // console.log(gltf.scene);
          this.scene.traverse(object => {
            if (object.name === "Circle002_4") {
              // console.log(object.material);
              // object.material.map = texture;
              // object.material.emissive = new Color("#ffffff");
              object.material = new MeshStandardMaterial({
                map : texture
              })
              console.log(object);
            }
          });
        },
        // called while loading is progressing
        function(xhr) {
          // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function(error) {
          console.log("An error happened", error);
        }
      );
    }
  }
};
</script>
<style>
.project-header {
  height: 60vh;
}
</style>
