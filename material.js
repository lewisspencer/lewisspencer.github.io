class VertexAttributes {
  postion;
  colour;
  normal;
  tangent;
  bitangent;
  uv;

  constructor(gl, shaderProgram) {
    this.postion = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    this.colour = gl.getAttribLocation(shaderProgram, "aVertexColour");
    this.normal = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    this.tangent = gl.getAttribLocation(shaderProgram, "aVertexTangent");
    this.bitangent = gl.getAttribLocation(shaderProgram, "aVertexBitangent");
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
  colourSampler;
  normalSampler;

  constructor(gl, shaderProgram) {
    this.projectionMatrix = gl.getUniformLocation(
      shaderProgram,
      "uProjectionMatrix"
    );
    this.viewMatrix = gl.getUniformLocation(shaderProgram, "uViewMatrix");
    this.modelMatrix = gl.getUniformLocation(shaderProgram, "uModelMatrix");
    this.normalMatrix = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
    this.viewPosition = gl.getUniformLocation(shaderProgram, "uViewPos");
    this.colourSampler = gl.getUniformLocation(shaderProgram, "uColourSampler");
    this.normalSampler = gl.getUniformLocation(shaderProgram, "uNormalSampler");
  }
}

class Material {
  shaderProgram;
  vertexAttributes;
  uniformLocation;
  colourTexture;
  normalTexture;

  constructor(
    gl,
    vsSource,
    fsSource,
    colourTexture = null,
    normalTexture = null
  ) {
    this.shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    this.vertexAttributes = new VertexAttributes(gl, this.shaderProgram);
    this.uniformLocation = new UniformLocation(gl, this.shaderProgram);
    this.colourTexture = colourTexture;
    this.normalTexture = normalTexture;
  }
}
