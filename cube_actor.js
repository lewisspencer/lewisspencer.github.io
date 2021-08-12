class RotatingCube extends Actor {
  constructor(gl) {
    const cube = new Cube(gl);
    const phongMaterial = new PhongMaterial(
      gl,
      loadTexture(gl, "https://media.githubusercontent.com/media/lewisspencer/lewisspencer.github.io/main/textures/brick.jpg")
    );
    super(cube, phongMaterial);
  }

  tick(deltaTime) {
    const rotationFactor = 0.3;
    quat.rotateY(this.rotation, this.rotation, deltaTime * rotationFactor);
    quat.rotateX(this.rotation, this.rotation, deltaTime * rotationFactor);
  }
}

class RotatingCubeNormalMapping extends Actor {
  constructor(gl) {
    const cube = new Cube(gl);
    const normalMaterial = new NormalMaterial(
      gl,
      loadTexture(gl, "https://media.githubusercontent.com/media/lewisspencer/lewisspencer.github.io/main/textures/brick.jpg"),
      loadTexture(gl, "https://media.githubusercontent.com/media/lewisspencer/lewisspencer.github.io/main/textures/brick_normal.jpg")
    );
    super(cube, normalMaterial);
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
      loadTexture(gl, "https://media.githubusercontent.com/media/lewisspencer/lewisspencer.github.io/main/textures/wood.jpg")
    );
    super(cube, phongMaterial);
  }
}

class SkyBox extends Actor {
  constructor(gl) {
    const cube = new Cube(gl);
    var urls = [
      "https://media.githubusercontent.com/media/lewisspencer/lewisspencer.github.io/main/textures/right.jpg",
      "https://media.githubusercontent.com/media/lewisspencer/lewisspencer.github.io/main/textures/left.jpg",
      "https://media.githubusercontent.com/media/lewisspencer/lewisspencer.github.io/main/textures/top.jpg",
      "https://media.githubusercontent.com/media/lewisspencer/lewisspencer.github.io/main/textures/bottom.jpg",
      "https://media.githubusercontent.com/media/lewisspencer/lewisspencer.github.io/main/textures/front.jpg",
      "https://media.githubusercontent.com/media/lewisspencer/lewisspencer.github.io/main/textures/back.jpg",
    ];

    const skyBoxMaterial = new SkyBoxMaterial(gl, loadCubemapTexture(gl, urls));
    super(cube, skyBoxMaterial);
  }
}
