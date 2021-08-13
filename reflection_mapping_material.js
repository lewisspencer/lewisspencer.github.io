class ReflectionMappingMaterial extends Material {
  constructor(gl, colourTexture) {
    const vsSource = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uNormalMatrix;

    // Shared with ps 
    varying highp vec3 vNormal;
    varying highp vec3 vFragPos;

    void main() {
      vNormal = mat3(uNormalMatrix) * aVertexNormal;
      mat4 modelViewMatrix = uViewMatrix * uModelMatrix;
      vFragPos = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
      gl_Position = uProjectionMatrix * modelViewMatrix * vec4(aVertexPosition, 1.0);
    }
    `;

    const fsSource = `   
    varying highp vec3 vNormal;
    varying highp vec3 vFragPos;
    
    uniform samplerCube uSampler;
    uniform highp vec3 uViewPos;
    uniform highp vec3 uCameraPos;
    void main() {
      highp vec3 I = normalize(vFragPos - uCameraPos);
      highp vec3 R = reflect(I, normalize(vNormal));
      highp vec4 texelColor = textureCube(uSampler, R);

      // Lighting params
      highp vec3 lightColour = vec3(1, 1, 1);
      highp vec3 lightPos = vec3(0, 10, 0);
      highp float ambientStrength = 0.9;
      highp float specularStrength = 0.5;
      highp float objectShininess = 32.;

      // Ambient
      highp vec3 ambient = ambientStrength * lightColour;

      // Diffuse
      highp vec3 norm = normalize(vNormal);
      highp vec3 lightDir = normalize(lightPos - vFragPos); 
      highp float diffuse = max(dot(norm, lightDir), 0.0);

      // Specular
      highp vec3 viewDir = normalize(uCameraPos - vFragPos);
      highp vec3 reflectDir = reflect(-lightDir, norm);  
      highp float specPower = pow(max(dot(viewDir, reflectDir), 0.0), objectShininess);
      highp vec3 specular = specularStrength * specPower * lightColour;  

      highp vec3 result = (ambient + diffuse + specular) * texelColor.rgb;
     
      gl_FragColor = vec4(result, 1.0);
    }
    `;

    super(gl, vsSource, fsSource, colourTexture);
  }
}
