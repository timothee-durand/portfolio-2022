import { ProjectGroup } from "./ProjectGroup.js";
import { Clock, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from "three";
import { Elastic, gsap } from "gsap";


export const HOVER_ENTER = "hover-enter";
export const HOVER_IN = "hover-in";
export const HOVER_OUT = "hover-out";

export default class ProjectPresentationMaster {
  height;
  width;
  elements = [];
  container;
  projects;
  raycaster = new Raycaster();
  pointer = new Vector2(0, 0);
  previousHover = [];
  router;
  _isDebug;

  constructor({ container, projects, router, isDebug }) {
    this.router = router;
    this._isDebug = isDebug;
    console.clear();
    this.container = container;
    this.projects = projects;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.container.addEventListener("pointermove", (e) => this.onPointerMove(e));
    this.container.addEventListener(
      "pointerenter",
      () => (this.isPointerOn = true)
    );
    this.container.addEventListener(
      "pointerleave",
      () => (this.isPointerOn = false)
    );

    this.container.addEventListener("click", () => {
      this.handleClick();
    });

    this.initThree();
    //this.initScenes()
  }


  initThree() {
    this.scene = new Scene();
    this.clock = new Clock();

    this.addCamera();
    this.addRenderer();
    this.addProjectGroups();
    //this.addController();

    window.addEventListener("resize", () => this.onResize());

    this.update();
  }

  addCamera() {
    this.camera = new PerspectiveCamera(60, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, -8, 20);
    this.scene.add(this.camera);
    // console.log(this.camera);

  }

  addRenderer() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
  }

  onResize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

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
  }

  async addProjectGroups() {
    const font = await this.loadFacetype();

    const SVGObject = await import("three/examples/jsm/renderers/SVGRenderer.js");
    const { TextGeometry } = await import("three/examples/jsm/geometries/TextGeometry.js");

    // console.log(this.projects);
    const rows = Math.ceil(this.projects.length / 2);
    const col = 2;
    let rowIndex = 0;

    this.projects.forEach((project, index) => {
      const projectGroup = new ProjectGroup({
        project: project,
        font,
        onTitleClick: ({ path }) => {
          this.router.push(path);
        },
        dependencies: {
          svgObject: SVGObject,
          textGeometry: TextGeometry
        }
      });
      const size = 0.5;
      projectGroup.scale.set(size, size, size);
      projectGroup.position.y = rowIndex * -8;

      if (index % 2) {
        projectGroup.position.x = -4;
        rowIndex++;
      } else {
        projectGroup.position.x = 4;

      }


      this.scene.add(projectGroup);
    });

    console.log(this.scene);

  }

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

  async addController() {
    const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
    this.controller = new OrbitControls(this.camera, this.renderer.domElement);
  }


  update() {
    if (this.isPointerOn) this.updateRaycaster();
    if (this.controller) this.controller.update();

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.update());
  }


  updateRaycaster() {
    // update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera(this.pointer, this.camera);
    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    //check the object that intersects
    for (let i = 0; i < intersects.length; i++) {
      let object = intersects[i].object;
      if (object.name === "") object = object.parent;

      if (!object.isAnimating) {
        this.handleObjectHover(object, object.isPreviousHover ? HOVER_IN : HOVER_ENTER);
        object.isPreviousHover = true;
      }
    }
    const intersectsObjects = intersects.map(i => i.object.name ? i.object : i.object.parent);
    this.previousHover.forEach(object => {
      if (!intersectsObjects.includes(object)) {
        object.isPreviousHover = false;
        this.handleObjectHover(object, HOVER_OUT);
      }
    });

    this.previousHover = intersectsObjects;
  }

  handleObjectHover(object, hoverState) {
    switch (object.name) {
      case "text" :
        this.hoverTechText(object, hoverState);
        break;
      case "title" :
        this.hoverTitleGroup(object, hoverState);
    }
  }

  hoverTechText(object, hoverState) {
    if (hoverState !== HOVER_IN) return;
    gsap.to(object.rotation, {
      onStart: () => {
        object.isAnimating = true;
      },
      x: Math.PI * 2,
      duration: 2,
      ease: Elastic.easeOut,
      onComplete: () => {
        object.isAnimating = false;
        object.rotation.x = 0;
      }
    });
  }


  hoverTitleGroup(object, hoverState) {
//    console.log(object, hoverState);
    switch (hoverState) {
      case HOVER_ENTER :
        gsap.to(object.scale, {
          onStart: () => {
            object.isAnimating = true;
            this.container.style.cursor = "pointer";
          },
          x: 1.3,
          y: 1.3,
          z: 1.3,
          duration: 1,
          ease: Elastic.easeOut,
          onComplete: () => {
            object.isAnimating = false;
          }
        });
        break;
/*      case HOVER_IN :
        this.container.style.cursor = "pointer";
        break;*/
      case HOVER_OUT :
        gsap.to(object.scale, {
          onStart: () => {
            object.isAnimating = true;
            this.container.style.cursor = "inherit";
          },
          x: 1,
          y: 1,
          z: 1,
          duration: 1.5,
          ease: Elastic.easeOut,
          onComplete: () => {
            object.isAnimating = false;
          }
        });
        break;
    }
  }

  handleClick() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    if (intersects.length === 0) return;
    let objectClick = intersects[0].object;
    //try to find projectGroup
    while (objectClick.parent && objectClick.name !== "project") {
      objectClick = objectClick.parent;
    }
    if (objectClick.type === "Scene") return;
    objectClick.onClick(intersects.map(i => i.object));
  }

  destroy() {
    this.renderer.domElement.remove();
  }


}
