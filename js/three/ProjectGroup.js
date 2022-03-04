import {
  CircleGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  Shape,
  TextureLoader,
  Vector2,
  Vector3
} from "three";
import { Bounce, gsap } from "gsap";
import { random } from "../utils/generative-utils.js";
import { SVG } from "@svgdotjs/svg.js";


export class ProjectGroup extends Group {
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
  previousHover = [];
  possibleStartPositions = [
    new Vector3(-4, 4, 0),
    new Vector3(0, 3, -1),
    new Vector3(-4, -5, -1),
    new Vector3(2, -4, -3)
  ];
  possiblePositionIndex = 0;
  dependencies;
  project;
  name = "project";
  onTitleClick = () => {};

  constructor({ project, font, dependencies, onTitleClick }) {
    super();
    this.project = project;
    this.textGeometryParameters.font = font;
    this.dependencies = dependencies;
    if (onTitleClick) this.onTitleClick = onTitleClick;
    //console.log(this.textGeometryParameters);

    this.shuffleArray(this.possibleStartPositions);
    this.addTechs();
  }

  addTechs() {

    this.project.techs.forEach((tech) => {
      const position = this.getRandomPosition();
      if (!position) {
        return;
      }
      const text = this.createTextGeometry(this.dependencies.textGeometry, tech);
      this.add(text);
      text.position.copy(position);
      text.randomScale = random(0.5, 0.7, true);
      text.startingTime = random(10, 2000);
      text.speed = random(0.5, 4, true);
      text.scale.set(0, 0, 0);

      this.launchAnimation(text);
    });

    this.addTitle();
    // console.log('---------')
  }

  addTitle() {

    const titleGroup = new Group();
    titleGroup.name = "title";
    const geometry = new CylinderGeometry(2.5, 2.5, 1, 32);
    const material = new MeshNormalMaterial();
    const cylinder = new Mesh(geometry, material);
    cylinder.rotation.x = Math.PI / 2;
    titleGroup.add(cylinder);

    const texture = new TextureLoader().load(this.project.thumbnail);
    texture.flipY = false;
    const circleGeometry = new CircleGeometry(2.5, 32);
    const circleMaterial = new MeshBasicMaterial({ map: texture });

    const circle = new Mesh(circleGeometry, circleMaterial);
    circle.position.z = -0.52;
    circle.rotation.y = Math.PI;
    titleGroup.add(circle);


    const text = this.createTextGeometry(this.dependencies.textGeometry, this.project.title, "");
    titleGroup.add(text);
    text.position.set(0, 0, 0.5);

    this.add(titleGroup);
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


  handleClick() {
    this.previousHover.forEach((object) => {
      switch (object.name) {
        case "title" :
          this.clickTitle(object);
      }
    });
  }

  clickTitle(object) {
    console.log("clickTitle");
  }

  onClick(intersects) {
    //check title
    let isTitle = false;
    intersects.forEach(object => {
      if ((object.name && object.name === "title") || object.parent.name === "title") {
        isTitle = true;
      }
    });

    if (isTitle) {
      this.onTitleClick(this.project)
    }
  }
}
