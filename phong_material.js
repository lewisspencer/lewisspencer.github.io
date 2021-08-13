class PhongMaterial extends Material {
  constructor(gl, colourTexture) {
    const vsSource = `
    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColour;
    attribute vec2 aTextureCoord;
    attribute vec3 aVertexNormal;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uNormalMatrix;

    // Shared with ps 
    varying lowp vec4 vColour; 
    varying highp vec2 vTextureCoord;
    varying highp vec3 vNormal;
    varying highp vec3 vFragPos;

    void main() {
        mat4 modelViewMatrix = uViewMatrix * uModelMatrix;
        gl_Position = uProjectionMatrix * modelViewMatrix * vec4(aVertexPosition, 1.0);
        vFragPos = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
        vColour = aVertexColour;
        vTextureCoord = aTextureCoord;
        vNormal = mat3(uNormalMatrix) * aVertexNormal;
    }
    `;

    const fsSource = `
    varying lowp vec4 vColour;
    varying highp vec2 vTextureCoord;
    varying highp vec3 vFragPos;
    varying highp vec3 vNormal;

    uniform highp vec3 uCameraPos;
    uniform sampler2D uColourSampler;

    void main() {
        // Lighting params
        highp vec3 lightColour = vec3(1, 1, 1);
        highp vec3 lightPos = vec3(0, 10, 0);
        highp float ambientStrength = 0.3;
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
        highp vec4 texelColor = texture2D(uColourSampler, vTextureCoord);

        highp vec3 result = (ambient + diffuse + specular) * texelColor.rgb;
        gl_FragColor = vec4(result, 1.0);
    }
    `;

    super(gl, vsSource, fsSource, colourTexture);
  }
}
