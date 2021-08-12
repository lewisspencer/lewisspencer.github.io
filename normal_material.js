class NormalMaterial extends Material {
  constructor(gl, colourTexture, normalTexture) {
    const vsSource = `
    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColour;
    attribute vec2 aTextureCoord;
    attribute vec3 aVertexNormal;
    attribute vec3 aVertexTangent;
    attribute vec3 aVertexBitangent;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uNormalMatrix;

    // Shared with ps 
    varying lowp vec4 vColour; 
    varying highp vec2 vTextureCoord;
    varying highp mat3 TBN;
    varying highp vec3 vFragPos;

    void main() {
        mat4 modelViewMatrix = uViewMatrix * uModelMatrix;
        gl_Position = uProjectionMatrix * modelViewMatrix * vec4(aVertexPosition, 1.0);
        vFragPos = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
        vColour = aVertexColour;
        vTextureCoord = aTextureCoord;
       
        vec3 T = normalize(vec3(uNormalMatrix * vec4(aVertexTangent,   0.0)));
        vec3 B = normalize(vec3(uNormalMatrix * vec4(aVertexBitangent, 0.0)));
        vec3 N = normalize(vec3(uNormalMatrix * vec4(aVertexNormal,    0.0)));
        TBN = mat3(T, B, N);
    }
    `;

    const fsSource = `
    varying lowp vec4 vColour;
    varying highp vec2 vTextureCoord;
    varying highp vec3 vFragPos;
    varying highp mat3 TBN;
    varying highp vec3 vNormal;

    uniform highp vec3 uViewPos;
    uniform sampler2D uColourSampler;
    uniform sampler2D uNormalSampler;

    void main() {
        // Lighting params
        highp vec3 lightColour = vec3(1, 1, 1);
        highp vec3 lightPos = vec3(0, 10, 0);
        highp float ambientStrength = 0.3;
        highp float specularStrength = 0.5;
        highp float objectShininess = 32.;

        // obtain texture normal from normal map in range [0,1]
        highp vec3 norm = texture2D(uNormalSampler, vTextureCoord).rgb;

        // transform normal vector to range [-1,1]
        norm = norm * 2.0 - 1.0;  
        norm = normalize(TBN * norm); 
     
        // Ambient
        highp vec3 ambient = ambientStrength * lightColour;

        // Diffuse
        highp vec3 lightDir = normalize(lightPos - vFragPos); 
        highp float diffuse = max(dot(norm, lightDir), 0.0);

        // Specular
        highp vec3 viewDir = normalize(uViewPos - vFragPos);
        highp vec3 reflectDir = reflect(-lightDir, norm);  
        highp float specPower = pow(max(dot(viewDir, reflectDir), 0.0), objectShininess);
        highp vec3 specular = specularStrength * specPower * lightColour;  
        highp vec4 texelColor = texture2D(uColourSampler, vTextureCoord);

        highp vec3 result = (ambient + diffuse + specular) * texelColor.rgb;
        gl_FragColor = vec4(result, 1.0);
    }
    `;

    super(gl, vsSource, fsSource, colourTexture, normalTexture);
  }
}
