import { BoxGeometry, Color, MeshNormalMaterial, PerspectiveCamera, Scene, WebGLRenderer, Mesh, AxesHelper } from "three";

export class ThreeBackground {
  height = window.innerHeight;
  width = window.innerWidth;
  elements = [];

  constructor({ container, elements }) {
    this.container = container;
    this.elements = elements;

    this.initThree();
    this.update()

    window.addEventListener("resize", ()=> this.onResize())
  }

  initThree() {
    this.scene = new Scene();
    this.scene.color = new Color("blue");

    this.addCamera();
    this.addRenderer();
    this.addBaseObject()
  }

  addCamera() {
    this.camera = new PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
    this.camera.position.set(1, 1, 1);
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

  update() {
    this.renderer.render(this.scene, this.camera)



    window.requestAnimationFrame(() => this.update())
  }

  addBaseObject() {
    const cubeGeom = new BoxGeometry(1, 1)
    const cubeMat = new MeshNormalMaterial()
    const cube = new Mesh(cubeGeom, cubeMat)
    this.scene.add(cube)

    const axesHelper = new AxesHelper( 5 );
    this.scene.add( axesHelper );
  }

  onResize() {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

}
