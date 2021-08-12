class SkyBoxMaterial extends Material {
  constructor(gl, colourTexture) {
    const vsSource = `
    attribute vec3 aVertexPosition;
  
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;

    varying highp vec3 vTextureCoord;
    void main() {
      vTextureCoord = aVertexPosition;
      mat4 modelViewMatrix = uViewMatrix * uModelMatrix;
      vec4 pos = uProjectionMatrix * modelViewMatrix * vec4(aVertexPosition, 1.0);
      // Fake max depth
      gl_Position = pos.xyww;
    }
    `;

    const fsSource = `   
    varying highp vec3 vTextureCoord;
    uniform samplerCube uSampler;

    void main() {
      gl_FragColor= textureCube(uSampler, vTextureCoord);
    }
    `;

    super(gl, vsSource, fsSource, colourTexture);
  }
}
