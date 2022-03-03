import {
  Clock,
  CylinderGeometry,
  CircleGeometry,
  Group,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Shape,
  Vector2,
  Vector3,
  WebGLRenderer, MeshBasicMaterial, DoubleSide, TextureLoader
} from "three";
import { Bounce, Elastic, gsap } from "gsap";
import { random } from "~/utils/generative-utils.js";
import { SVG } from "@svgdotjs/svg.js";


const HOVER_ENTER = "hover-enter";
const HOVER_IN = "hover-in";
const HOVER_OUT = "hover-out";

export class ProjectPresentationThree {
  container;
  isInScreen = false;
  technos = [];
  pointer = new Vector2(0, 0);
  raycaster = new Raycaster();
  font;
  textGeometryParameters = {
    size: 2,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  };
  lastElapsedTime = 0;
  isPointerOn = false;
  previousHover = [];

  possibleStartPositions = [
    new Vector3(-4, 4, 0),
    new Vector3(0, 3, -1),
    new Vector3(-4, -5, -1),
    new Vector3(2, -4, -3)
  ];
  possiblePositionIndex = 0;
  dependencies;

  constructor({ container, font, dependencies }) {
    this.container = container;
    this.textGeometryParameters.font = font;
    this.dependencies = dependencies;
    this.technos = JSON.parse(this.container.dataset.techno);
    this.projectTitle = this.container.dataset.title;

    if (!this.technos) {
      console.error("There is no tech to print out !", this.container);
      return;
    }
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.initThree();
    this.update();
    window.addEventListener("resize", () => this.onResize());
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
      this.handleClick()
    })

    this.shuffleArray(this.possibleStartPositions);
  }

  initThree() {
    this.scene = new Scene();
    this.clock = new Clock();

    this.addCamera();
    this.addRenderer();
    this.addBaseObject();
    this.addController();
    //render once
    this.renderer.render(this.scene, this.camera);
  }

  addCamera() {
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.set(-2, -2, 10);
    this.scene.add(this.camera);
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

  async addBaseObject() {


    this.technos.forEach((tech) => {
      const position = this.getRandomPosition();
      if (!position) {
        return;
      }
      const text = this.createTextGeometry(this.dependencies.textGeometry, tech);
      this.scene.add(text);
      text.position.copy(position);
      text.randomScale = random(0.5, 0.7, true);
      text.startingTime = random(10, 2000);
      text.speed = random(0.5, 4, true);
      text.scale.set(0, 0, 0);

      this.launchAnimation(text);
    });

    this.addBlobObject();
    // console.log('---------')
  }

  addBlobObject() {
    // const node = this.getBlobPath()
    // const object = new this.dependencies.svgObject.SVGObject(node)
    // console.log(object);
    // this.scene.add(object)

    // const shape = this.getBlobShape();
    // const extrudeSettings = {
    //   depth: 1,
    //   bevelEnabled: false,
    //   bevelSegments: 2,
    //   steps: 2,
    //   bevelSize: 1,
    //   bevelThickness: 1
    // };
    //
    // const geometry = new ExtrudeGeometry(shape, extrudeSettings);
    //
    // const mesh = new Mesh(geometry, new MeshNormalMaterial());
    // this.scene.add(mesh);

    const titleGroup = new Group();
    titleGroup.name = "title";
    const geometry = new CylinderGeometry(2.5, 2.5, 1, 32);
    const material = new MeshNormalMaterial();
    const cylinder = new Mesh(geometry, material);
    cylinder.rotation.x = Math.PI / 2;
    titleGroup.add(cylinder);

    const texture = new TextureLoader().load("./image.jpg")
    texture.flipY = false
    const circleGeometry = new CircleGeometry( 2.5, 32 );
    const circleMaterial = new MeshBasicMaterial( { map: texture } );
    console.log(circleMaterial);
    const circle = new Mesh( circleGeometry, circleMaterial );
    circle.position.z = -0.52
    circle.rotation.y = Math.PI
    titleGroup.add( circle );


    const text = this.createTextGeometry(this.dependencies.textGeometry, this.projectTitle, "");
    titleGroup.add(text);
    text.position.set(0, 0, 0.5);

    this.scene.add(titleGroup);
  }

  getRandomPosition() {
    if (this.possiblePositionIndex >= this.possibleStartPositions.length - 1)
      return null;
    const randomPos = this.possibleStartPositions[this.possiblePositionIndex];
    this.possiblePositionIndex++;
    return randomPos;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]];
    }
  }

  createTextGeometry(TextGeometry, text, objectName = "text") {
    const textGeometry = new TextGeometry(text, this.textGeometryParameters);
    //center pivot point
    textGeometry.center();
    const textMaterial = new MeshNormalMaterial();
    const mesh = new Mesh(textGeometry, textMaterial);
    mesh.name = objectName;
    return mesh;
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
      if (this.isPointerOn) this.updateRaycaster();
      if (this.controller) this.controller.update();
      this.renderer.render(this.scene, this.camera);
    }
    window.requestAnimationFrame(() => this.update());
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

  /**
   * Keep the property by copying it and adding a prefix
   * @param {object} object
   * @param {string} property
   * @param {string} prefix
   */
  captureProperty(object, property = "position", prefix = "start") {
    if (!object[property]) {
      console.error(
        `Property ${property} does not exist on this object : `,
        object
      );
      return;
    }
    object[
      `${prefix}${property.charAt(0).toUpperCase()}${property.slice(
        1,
        property.length
      )}`
      ] = object[property];
  }

  launchAnimation(text) {
    const animationProxy = {
      positionX: text.position.x,
      positionY: text.position.y,
      rotationY: text.rotation.y,
      positionZ: text.position.z
    };
    // console.log(text)
    gsap.to(text.scale, {
      x: text.randomScale,
      y: text.randomScale,
      z: text.randomScale,
      duration: 0.5,
      ease: Bounce.easeOut
    });

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
          text.position.x = animationProxy.positionX;
          text.position.y = animationProxy.positionY;
          // text.position.z = animationProxy.positionZ;
          // text.rotation.y = animationProxy.rotationY
        }
      });
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

  getBlobShape() {
    const svg = SVG();
    const width = 4;
    const size = random(width * 0.5, width * 0.8);
    // choose a random number of points
    const numPoints = random(5, 10);
    // step used to place each point at equal distances
    const angleStep = (Math.PI * 2) / numPoints;

    // keep track of our points
    const points = [];

    const baseX = 0;
    const baseY = 0;

    let shape = new Shape();

    //points generation
    for (let i = 1; i <= numPoints; i++) {
      // how much randomness should be added to each point
      const pull = random(0.50, 1.5, true);

      // x & y coordinates of the current point
      const x = baseX + Math.cos(i * angleStep) * (size * pull);
      const y = baseY + Math.sin(i * angleStep) * (size * pull);

      // push the point to the points array
      points.push(new Vector2(x, y));
    }
    console.log(points);
    //path generation
    //adaptation of https://github.com/georgedoescode/generative-utils/blob/master/src/spline.js
    const tension = 3;
    //go to first point
    const firstPoint = points[0];
    shape.moveTo(firstPoint.x, firstPoint.y);

    // for (let i = 1; i < points.length - 1; i++) {
    //   const actualPoint = points[i];
    //   //point before (for control point 1 calculation)
    //   const previousPoint = points[i - 1] || points[0];
    //   //destination point
    //   const nextPoint = points[i + 1];
    //   //point after the destination point (for control 2 calculation)
    //   const thirdPoint = points[i + 2] || points[points.length - 1];
    //
    //   const controlPoint1 = new Vector2(
    //     actualPoint.x + ((nextPoint.x - previousPoint.x) / 6) * tension,
    //     actualPoint.y + ((nextPoint.y - previousPoint.y) / 6) * tension
    //   );
    //
    //   const controlPoint2 = new Vector2(
    //     nextPoint.x + ((thirdPoint.x - actualPoint.x) / 6) * tension,
    //     nextPoint.y + ((thirdPoint.y - actualPoint.y) / 6) * tension
    //   );
    //
    //   shape.bezierCurveTo(
    //     controlPoint1.x,
    //     controlPoint1.y,
    //     controlPoint2.x,
    //     controlPoint2.y,
    //     nextPoint.x,
    //     nextPoint.y);
    // }

    for (let i = 0; i < points.length; i++) {
      const actualPoint = points[i];
      const nextPoint = points[i + 1] || points[0];

      const halfDist = actualPoint.distanceTo(nextPoint) / 2;
      const tension = 0.5;

      const midPoint = new Vector2(
        (actualPoint.x + nextPoint.x) / 2,
        (actualPoint.y + nextPoint.y) / 2
      );

      const normalVector = new Vector2(
        nextPoint.y - actualPoint.y,
        nextPoint.x - actualPoint.x
      );


      // const angle = Math.atan(Math.pow((nextPoint.y - actualPoint.y) / (nextPoint.x - actualPoint.x), -1));

      const controlPoint = new Vector2(
        normalVector.x * tension + midPoint.x,
        normalVector.y * tension + midPoint.y
      );

      controlPoint.multiply(tension);

      shape.quadraticCurveTo(
        controlPoint.x,
        controlPoint.y,
        nextPoint.x,
        nextPoint.y
      );
    }


    return shape;
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

      if(!object.isAnimating) {
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

  addController() {
    this.controller = new this.dependencies.controls.OrbitControls(this.camera, this.renderer.domElement);

  }

  hoverTitleGroup(object, hoverState) {
    switch (hoverState) {
      case HOVER_ENTER :
        gsap.to(object.rotation, {
          onStart: () => {
            object.isAnimating = true;
          },
          x: Math.PI,
          duration: 2,
          ease: Elastic.easeOut,
          onComplete: () => {
            object.isAnimating = false;
          }
        });
        this.container.style.cursor = "pointer"
        break;

      case HOVER_OUT :
        gsap.to(object.rotation, {
          onStart: () => {
            object.isAnimating = true;
          },
          x: 0,
          duration: 2,
          ease: Elastic.easeOut,
          onComplete: () => {
            object.isAnimating = false;
            object.isScreenFace = false;
          }
        });
        this.container.style.cursor = "inherit"
        break;
    }

  }

  handleClick() {
    this.previousHover.forEach((object) => {
      switch (object.name) {
        case "title" :
          this.clickTitle(object);
      }
    })
  }

  clickTitle(object) {
    console.log("clickTitle");
  }
}
