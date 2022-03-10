<template>
  <div ref="canvas" class="project-header" />
</template>
<script>
import {
  AdditiveBlending,
  BufferGeometry,
  Clock,
  Color,
  Float32BufferAttribute, Group,
  Mesh,
  MeshToonMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  RepeatWrapping,
  Scene,
  SpotLight,
  TextureLoader,
  Vector2,
  WebGLRenderer
} from "three";
import { mapState } from "vuex";
import { DARK_MODE } from "@/store/index.js";
import { random } from "@/js/utils/generative-utils.js";

const baseTexturePath = "/textures/";
const wallDirName = "wall";
const particlesSpritesDirName = "particles";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

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
        bevelEnabled: false,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      },
      pointer: new Vector2(0, 0),
      isPhone : false,
      lastElapsedTime : 0
    };
  },
  computed: mapState(["themeMode"]),
  async mounted() {
    this.container = this.$refs.canvas;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    await this.initThree();
    await this.loadTextures();
    await this.addModels();
    this.addLights();
    this.addParticles();
    this.update();

    this.isPhone = (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0))
      && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  },
  methods: {
    async initThree() {
      this.scene = new Scene();
      this.clock = new Clock();

      this.camera = new PerspectiveCamera(60, this.width / this.height, 0.1, 1000);
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

      this.textureLoader = new TextureLoader();

      // const {OrbitControls} = await import("three/examples/jsm/controls/OrbitControls.js")
      // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.$parent.$el.addEventListener("mousemove", (e) => this.onPointerMove(e));
      window.addEventListener("resize", () => this.onResize());

    },
    onPointerMove(e) {
      if(this.isPhone) return
      // calculate pointer position in normalized device coordinates
      // (-1 to +1) for both components
      const { left, top } = this.$parent.$el.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      this.pointer.x = (x / this.$parent.$el.offsetWidth) * 2 - 1;
      this.pointer.y = -(y / this.$parent.$el.offsetHeight) * 2 + 1;
      //this.updateRaycaster();
    },
    onResize() {
      // Update sizes
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;

      // Update camera
      this.camera.aspect = this.width / this.height;
      console.log("resize");
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    },
    update() {

     // const time = Date.now() * 0.00005;

      if(!this.isPhone) {
        //if laptop
        this.camera.position.x += (-this.pointer.x - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.pointer.y - this.camera.position.y) * 0.05;
      } else {
        //if phone / tablet / ...
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.lastElapsedTime
        this.lastElapsedTime = elapsedTime

        this.titleObject.rotation.y = Math.sin(elapsedTime * 0.8) * 0.3
        this.titleObject.rotation.x = Math.cos(elapsedTime * 0.8) * 0.3

        this.particles.rotation.z = this.particles.rotation.z + deltaTime * 0.05
        this.particles.position.z = Math.sin(elapsedTime * 0.3) * 0.3

      }


      this.camera.lookAt(this.scene.position);

      if (this.controls) this.controls.update();
     if (this.titleObject) {
        if (this.themeMode === DARK_MODE) {
          this.titleObject.material.color = new Color("#E1EFE6");
        } else {
          this.titleObject.material.color = new Color("#000411");
        }
      }

      this.renderer.render(this.scene, this.camera);

      window.requestAnimationFrame(() => this.update());
    },
    loadTexture(directoryName, fileName) {
//      console.log(directoryName, fileName);
      return new Promise((resolve => {
        this.textureLoader.load(baseTexturePath + directoryName + "/" + fileName,
          (texture) => {
            resolve(texture);
          }
        );
      }));
    },
    async loadTextures() {
      const textures = {};
      //roughnessMap
      textures.roughness = await this.loadTexture(wallDirName, "wall-roughness.jpg");
      textures.roughness.wrapS = RepeatWrapping;
      textures.roughness.wrapT = RepeatWrapping;
      textures.roughness.repeat.set(4, 4);

      //particles sprites
      textures.eclair1 = await this.loadTexture(particlesSpritesDirName, "eclair-1.png");
      textures.eclair2 = await this.loadTexture(particlesSpritesDirName, "eclair-2.png");
      textures.circle1 = await this.loadTexture(particlesSpritesDirName, "circle-1.png");
      textures.circle2 = await this.loadTexture(particlesSpritesDirName, "circle-2.png");

      this.textures = textures;
    },
    addLights() {
      // this.ambiantLight = new AmbientLight("#b46930", 1);
      // this.ambiantLight.position.set()
      // this.scene.add(this.ambiantLight);
      this.spotLight = new SpotLight("white", 2, 20, Math.PI / 3);
      this.spotLight.position.set(0, 10, 10);
      this.scene.add(this.spotLight);
    },
    async addModels() {

      // const plane = new Mesh(
      //   new PlaneGeometry(20, 20, 100, 100),
      //   new MeshPhysicalMaterial({
      //     // normalMap : textures.normal,
      //     //heightMap : textures.height,
      //     roughness : 1,
      //     roughnessMap : this.textures.roughness,
      //     // aoMap: textures.ao,
      //     thickness : 0.5,
      //     color: "white",
      //     transmission: 1
      //   })
      // );
      // plane.position.z = -1;
      // this.scene.add(plane);
      this.titleObject = await this.createTextGeometry(this.projectTitle);
      this.scene.add(this.titleObject);
    },
    async createTextGeometry(text, objectName = "text") {
      const { TextGeometry } = await import("three/examples/jsm/geometries/TextGeometry.js");
      this.textGeometryParameters.font = await this.loadFacetype();
      const textGeometry = new TextGeometry(text, this.textGeometryParameters);
      //center pivot point
      textGeometry.center();
      const textMaterial = new MeshToonMaterial({
        color: "white",
        reflectivity: 0
      });
      const mesh = new Mesh(textGeometry, textMaterial);
      mesh.name = objectName;
      return mesh;
    },
    addParticles() {
      const geometry = new BufferGeometry();
      const vertices = [];
      const r = 3;

      for (let i = 0; i < random(5, 10); i++) {
        /*    const x = areaSize * Math.random() - (areaSize / 2);
            const y = areaSize * Math.random() - (areaSize / 2);
            const z = areaSize * Math.random() - (areaSize / 2);*/
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        const z = Math.cos(Math.random() * Math.PI) * r;
        vertices.push(x, y, z);
      }

      geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));

      const textures = [
        this.textures.eclair1,
        this.textures.eclair2,
        this.textures.circle1,
        this.textures.circle2
      ];

      this.particles = new Group()
      const possibleRotations = [
        0, Math.PI / 2, Math.PI / 3
      ];
      shuffleArray(possibleRotations);
      for (let i = 0; i < textures.length; i++) {
        const material = new PointsMaterial({
          size: 0.3,
          // sizeAttenuation: false,
          // color: "white",
          // alphaTest: 0.5,
          transparent: true,
          // depthTest : false,
          map: textures[i],
          blending: AdditiveBlending
        });
        const particles = new Points(geometry, material);
        particles.position.z = random(-1, -3);
        particles.rotation.z = possibleRotations[0];
        possibleRotations.shift();
        this.particles.add(particles);
      }

      this.scene.add(this.particles)

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
