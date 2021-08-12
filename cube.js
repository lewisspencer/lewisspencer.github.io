class Cube extends Model {
  constructor(gl) {
    const positions = [
      -1, -1,  1,   1,  1,  1,  -1,  1,  1,   1, -1,  1, // Front
      -1, -1, -1,   1,  1, -1,  -1,  1, -1,   1, -1, -1, // Back
       1, -1, -1,   1,  1,  1,   1, -1,  1,   1,  1, -1, // Right
      -1, -1, -1,  -1,  1,  1,  -1, -1,  1,  -1,  1, -1, // Left
      -1,  1, -1,   1,  1,  1,  -1,  1,  1,   1,  1, -1, // Top
      -1, -1, -1,   1, -1,  1,  -1, -1,  1,   1, -1, -1, // Bottom
    ];

    const faceColours = [
      [1.0, 1.0, 1.0, 1.0], // Front face: white
      [1.0, 0.0, 0.0, 1.0], // Back face: red
      [1.0, 1.0, 0.0, 1.0], // Right face: yellow
      [1.0, 0.0, 1.0, 1.0], // Left face: purple
      [0.0, 1.0, 0.0, 1.0], // Top face: green
      [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    ];

    var colours = [];

    for (var j = 0; j < faceColours.length; ++j) {
      const c = faceColours[j];

      // Repeat each color four times for the four vertices of the face
      colours = colours.concat(c, c, c, c);
    }

    const indices = [
      0 , 1 , 2 ,    0 , 3 , 1 , // Front
      4 , 6 , 5 ,    4 , 5 , 7 , // Back
      8 , 9 , 10,    8 , 11, 9 , // Right
      12, 14, 13,    12, 13, 15, // Left
      16, 18, 17,    16, 17, 19, // Top
      20, 21, 22,    20, 23, 21, // Bottom
    ];

    const textureCoordinates = [
      0,  1,  1,  0,  0,  0,  1,  1, // Front
      1,  1,  0,  0,  1,  0,  0,  1, // Back
      1,  1,  0,  0,  0,  1,  1,  0, // Right
      0,  1,  1,  0,  1,  1,  0,  0, // Left
      0,  0,  1,  1,  0,  1,  1,  0, // Top
      0,  1,  1,  0,  0,  0,  1,  1, // Bottom
    ];

    const vertexNormals = [    
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,// Front
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,   // Back
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // Right
      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,// Left
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,// Top     
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,// Bottom
    ];

    const vertexTangents = [
      1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0, // Front
      -1,  0,  0,  -1,  0,  0,  -1,  0,  0,  -1,  0,  0, // Back
       0,  0, -1,   0,  0, -1,   0,  0, -1,   0,  0, -1, // Right
       0,  0,  1,   0,  0,  1,   0,  0,  1,   0,  0,  1, // Left
       1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0, // Top
       1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0, // Bottom
    ];

    const vertexBitangents = [
      0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0, // Front
      0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0, // Back
      0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0, // Right
      0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0, // Left
      0,  0,  1,   0,  0,  1,   0,  0,  1,   0,  0,  1, // Top
      0,  0, -1,   0,  0, -1,   0,  0, -1,   0,  0, -1, // Bot
    ];
   
    super(gl, positions, indices, colours, textureCoordinates, vertexNormals, vertexTangents, vertexBitangents);
  }
}
