class Actor {
  model;
  material;
  position;
  rotation;
  scale;

  constructor(model, material) {
    this.model = model;
    this.material = material;

    // Local space
    this.position = [0.0, 0.0, 0.0];
    this.rotation = [0.0, 0.0, 0.0, 1.0];
    this.scale = [1.0, 1.0, 1.0];
  }

  // Getters
  get modelMatrix() {
    var modelMatrix = mat4.create();
    return mat4.fromRotationTranslationScale(
      modelMatrix,
      this.rotation,
      this.position,
      this.scale
    );
  }

  get normalMatrix() {
    var normalMatrix = mat4.create();
    mat4.invert(normalMatrix, this.modelMatrix);
    return mat4.transpose(normalMatrix, normalMatrix);
  }

  tick(deltaTime) {}

  draw(gl, projectionMatrix, viewMatrix, cameraPosition) {
    this.model.draw(
      gl,
      this.material,
      projectionMatrix,
      viewMatrix,
      cameraPosition,
      this.modelMatrix,
      this.normalMatrix
    );
  }
}
