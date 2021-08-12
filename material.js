class VertexAttributes {
  postion;
  colour;
  normal;
  uv;

  constructor(gl, shaderProgram) {
    this.postion = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    this.colour = gl.getAttribLocation(shaderProgram, "aVertexColour");
    this.normal = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    this.uv = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  }
}

// Really most of this is todo with the model
class UniformLocation {
  projectionMatrix;
  viewMatrix;
  modelMatrix;
  normalMatrix;
  viewPosition;
  sampler;

  constructor(gl, shaderProgram) {
    this.projectionMatrix = gl.getUniformLocation(
      shaderProgram,
      "uProjectionMatrix"
    );
    this.viewMatrix = gl.getUniformLocation(shaderProgram, "uViewMatrix");
    this.modelMatrix = gl.getUniformLocation(shaderProgram, "uModelMatrix");
    this.normalMatrix = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
    this.viewPosition = gl.getUniformLocation(shaderProgram, "uViewPos");
    this.sampler = gl.getUniformLocation(shaderProgram, "uSampler");
  }
}

class Material {
  shaderProgram;
  vertexAttributes;
  uniformLocation;
  colourTexture;

  constructor(gl, vsSource, fsSource, colourTexture) {
    this.shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    this.vertexAttributes = new VertexAttributes(gl, this.shaderProgram);
    this.uniformLocation = new UniformLocation(gl, this.shaderProgram);
    this.colourTexture = colourTexture;
  }
}
