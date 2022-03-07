<template>
  <div ref="canvas" class="project-header" />
</template>
<script>
import {
  AmbientLight,
  BufferGeometry,
  Clock,
  Float32BufferAttribute,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector2, Vector3,
  WebGLRenderer
} from "three";


export default {
  name: "ProjectHeader",
  props: {
    projectTitle: {
      type: String,
      default: "Project Title"
    }
  },
  data() {
    return {
      textGeometryParameters: {
        size: 1,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      },
      pointer: new Vector2(0, 0)
    };
  },
  async mounted() {
    this.container = this.$refs.canvas;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    await this.initThree();
    await this.addModels();
    this.addParticles();
    this.update();
  },
  methods: {
    async initThree() {
      this.scene = new Scene();
      this.clock = new Clock();

      this.camera = new PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
      this.camera.position.set(0, 0, 5);
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
      this.container.appendChild(this.renderer.domElement);

      // const {OrbitControls} = await import("three/examples/jsm/controls/OrbitControls.js")
      // this.controls = new OrbitControls(this.camera, this.renderer.domElement)

      this.container.addEventListener("pointermove", (e) => this.onPointerMove(e));

      this.ambiantLight = new AmbientLight(0xffffff, 2);
      this.scene.add(this.ambiantLight);


    },
    onPointerMove(e) {
      // calculate pointer position in normalized device coordinates
      // (-1 to +1) for both components
      const { left, top } = this.container.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      this.pointer.x = (x / this.container.offsetWidth) * 2 - 1;
      this.pointer.y = -(y / this.container.offsetHeight) * 2 + 1;
      this.isPointerOn = true;
      //this.updateRaycaster();
    },
    update() {

      const time = Date.now() * 0.00005;

      this.camera.position.x += (-this.pointer.x - this.camera.position.x) * 0.05;
      this.camera.position.y += (-this.pointer.y - this.camera.position.y) * 0.05;

      this.camera.lookAt(this.scene.position);

      if (this.controls) this.controls.update()

      this.renderer.render(this.scene, this.camera);

      window.requestAnimationFrame(() => this.update());
    },
    async addModels() {
      const titleObject = await this.createTextGeometry(this.projectTitle);
      this.scene.add(titleObject);
    },
    async createTextGeometry(text, objectName = "text") {
      const { TextGeometry } = await import("three/examples/jsm/geometries/TextGeometry.js");
      this.textGeometryParameters.font = await this.loadFacetype();
      const textGeometry = new TextGeometry(text, this.textGeometryParameters);
      //center pivot point
      textGeometry.center();
      const textMaterial = new MeshNormalMaterial();
      const mesh = new Mesh(textGeometry, textMaterial);
      mesh.name = objectName;
      return mesh;
    },
    addParticles() {
      const geometry = new BufferGeometry();
      const vertices = [];
      const r = 3;

      for (let i = 0; i < 500; i++) {
        /*    const x = areaSize * Math.random() - (areaSize / 2);
            const y = areaSize * Math.random() - (areaSize / 2);
            const z = areaSize * Math.random() - (areaSize / 2);*/
        const angle = Math.random() * Math.PI * 2
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        const z =  Math.cos(Math.random() * Math.PI ) * r;
        vertices.push(x, y, z);
      }

      geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));

      const material = new PointsMaterial({
        size: 2,
        sizeAttenuation: false,
        color: "white",
        alphaTest: 0.5,
        transparent: true
      });

      const particles = new Points(geometry, material);
      this.scene.add(particles);

    },
    loadFacetype() {
      return new Promise(async (resolve) => {
          const { FontLoader } = await import("three/examples/jsm/loaders/FontLoader.js");
          const fontLoader = new FontLoader();
          fontLoader.load(
            "/facetypes/commune_nuit_debout.typeface.json.json",
            (font) => {
              resolve(font);
            }
          );
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
