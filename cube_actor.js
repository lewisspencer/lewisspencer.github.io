class RotatingCube extends Actor {
  constructor(gl) {
    const cube = new Cube(gl);
    const phongMaterial = new PhongMaterial(
      gl,
      loadTexture(gl, "https://i.imgur.com/ArXY8zX.jpeg")
    );
    super(cube, phongMaterial);
  }

  tick(deltaTime) {
    const rotationFactor = 0.3;
    quat.rotateY(this.rotation, this.rotation, deltaTime * rotationFactor);
    quat.rotateX(this.rotation, this.rotation, deltaTime * rotationFactor);
  }
}

class StaticCube extends Actor {
  constructor(gl) {
    const cube = new Cube(gl);
    const phongMaterial = new PhongMaterial(
      gl,
      loadTexture(gl, "textures/wood.jpg")
    );
    super(cube, phongMaterial);
  }
}

class SkyBox extends Actor {
  constructor(gl) {
    const cube = new Cube(gl);
    var urls = [
      "textures/right.jpg",
      "textures/left.jpg",
      "textures/top.jpg",
      "textures/bottom.jpg",
      "textures/front.jpg",
      "textures/back.jpg",
    ];

    const skyBoxMaterial = new SkyBoxMaterial(gl, loadCubemapTexture(gl, urls));
    super(cube, skyBoxMaterial);
  }
}
