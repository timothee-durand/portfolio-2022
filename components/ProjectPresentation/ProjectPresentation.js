import { Clock, Mesh, MeshNormalMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { random } from "~/utils/generative-utils.js";

export class ProjectPresentation {
  container;
  isInScreen = false;
  technos = [];
  font;
  textGeometryParameters = {
    size: 3,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  };
  lastElapsedTime = 0

  constructor({ container, font }) {
    this.container = container;
    this.textGeometryParameters.font = font;
    this.technos = JSON.parse(this.container.dataset.techno);

    if (!this.technos) {
      console.error("There is no tech to print out !", this.container);
      return;
    }
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.initThree();
    this.update();
    window.addEventListener("resize", () => this.onResize());
  }

  initThree() {
    this.scene = new Scene();
    this.clock = new Clock();

    this.addCamera();
    this.addRenderer();
    this.addBaseObject();
  }

  addCamera() {
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.set(-2, -2, 10);
    this.scene.add(this.camera);
  }

  addRenderer() {
    this.renderer = new WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
  }

  async addBaseObject() {
    // const cubeGeom = new BoxGeometry(1, 1);
    // const cubeMat = new MeshNormalMaterial();
    // const cube = new Mesh(cubeGeom, cubeMat);
    // this.scene.add(cube);
    // cube.position.set(0, 0, 0);
    // this.cube = cube;

    const { TextGeometry } = await import("three/examples/jsm/geometries/TextGeometry.js");

    //  this.technos.forEach(tech => {
    this.text = this.createTextGeometry(TextGeometry, this.technos[0]);
    this.scene.add(this.text);
    this.text.position.set(-3, 2, 0)
    //  })

    this.capturePosition(this.text)
    this.text.startingTime = random(10, 2000)
    this.text.speed = random(0.5, 4, true)
    console.log(this.text);
  }

  createTextGeometry(TextGeometry, text) {
    const textGeometry = new TextGeometry(
      text,
      this.textGeometryParameters
    );
    const textMaterial = new MeshNormalMaterial();
    return new Mesh(textGeometry, textMaterial);
  }

  update() {
    if (this.isInScreen) {
      const elapsedTime = this.clock.getElapsedTime()
      this.lastElapsedTime = elapsedTime
      if(this.text) {
        this.text.position.y = this.text.startPosition.y - (Math.cos((elapsedTime + this.text.startingTime) * this.text.speed) * 0.01);
      }
      this.renderer.render(this.scene, this.camera);
    }
    window.requestAnimationFrame(() => this.update());
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }


  capturePosition(object) {
    object.startPosition = object.position
  }
}
