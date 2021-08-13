class Model {
  // GL buffers
  vertices;
  indices;
  colours;
  uvs;
  normals;
  tangents;
  bitangents;
  indicesCount;

  constructor(gl, vertices, indices, colours, uvs, normals, tangents, bitangents) {
    // Vertex buffer
    this.vertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Index buffer
    this.indicesCount = indices.length;
    this.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    // Colour buffer
    this.colours = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colours);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);

    // UV buffer
    this.uvs = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvs);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

    // Normal buffer
    this.normals = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    // Tangent buffer
    this.tangents = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tangents);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);

    // Bitangent buffer
    this.bitangents = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bitangents);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bitangents), gl.STATIC_DRAW);
  }

  draw(gl, material, projectionMatrix, viewMatrix, cameraPosition, modelMatrix, normalMatrix) {
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 3; // size of the vertex
      const type = gl.FLOAT; // the data in the buffer is 32bit floats
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set of values to the next
      // 0 = use type and numComponents above
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
      gl.vertexAttribPointer(
        material.vertexAttributes.position,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(material.vertexAttributes.position);
    }

    // Tell WebGL which indices to use to index the vertices
    {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    }

    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    if (gl.getAttribLocation(material.shaderProgram, "aVertexColour") != -1) {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colours);
      gl.vertexAttribPointer(
        material.vertexAttributes.colour,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(material.vertexAttributes.colour);
    }

    // Tell WebGL how to pull out the texture coordinates from buffer
    if (gl.getAttribLocation(material.shaderProgram, "aTextureCoord") != -1) {
      const num = 2; // every coordinate composed of 2 values
      const type = gl.FLOAT; // the data in the buffer is 32 bit float
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set to the next
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvs);
      gl.vertexAttribPointer(
        material.vertexAttributes.uv,
        num,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(material.vertexAttributes.uv);
    }

    // Tell WebGL how to pull out the normals from buffer
    if (gl.getAttribLocation(material.shaderProgram, "aVertexNormal") != -1) {
      const num = 3; // every coordinate composed of 2 values
      const type = gl.FLOAT; // the data in the buffer is 32 bit float
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set to the next
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normals);
      gl.vertexAttribPointer(
        material.vertexAttributes.normal,
        num,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(material.vertexAttributes.normal);
    }

     // Tell WebGL how to pull out the tangents from buffer
     if (gl.getAttribLocation(material.shaderProgram, "aVertexTangent") != -1) {
      const num = 3; // every coordinate composed of 2 values
      const type = gl.FLOAT; // the data in the buffer is 32 bit float
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set to the next
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, this.tangents);
      gl.vertexAttribPointer(
        material.vertexAttributes.tangent,
        num,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(material.vertexAttributes.tangent);
    }

     // Tell WebGL how to pull out the Bitangent from buffer
     if (gl.getAttribLocation(material.shaderProgram, "aVertexBitangent") != -1) {
      const num = 3; // every coordinate composed of 2 values
      const type = gl.FLOAT; // the data in the buffer is 32 bit float
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set to the next
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bitangents);
      gl.vertexAttribPointer(
        material.vertexAttributes.bitangent,
        num,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(material.vertexAttributes.bitangent);
    }

    // Tell WebGL to use our program when drawing
    gl.useProgram(material.shaderProgram);

    // Set the projection and matrices
    gl.uniformMatrix4fv(
      material.uniformLocation.projectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(material.uniformLocation.viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(
      material.uniformLocation.modelMatrix,
      false,
      modelMatrix
    );
    gl.uniformMatrix4fv(
      material.uniformLocation.normalMatrix,
      false,
      normalMatrix
    );

    gl.uniform3fv(material.uniformLocation.cameraPosition, cameraPosition);

    // Tell WebGL we want to affect texture unit 0

    // Bind the texture to texture unit 0
    if (material.colourTexture !== null) {
      gl.activeTexture(gl.TEXTURE0);

      if (material.colourTexture.isCubeMap) {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, material.colourTexture.texture);
      } else {
        gl.bindTexture(gl.TEXTURE_2D, material.colourTexture.texture);
      }
      // Tell the shader we bound the texture to texture unit 0
      gl.uniform1i(material.uniformLocation.colourSampler, 0);
    }

    if (material.normalTexture !== null) {
      gl.activeTexture(gl.TEXTURE1);

      if (material.normalTexture.isCubeMap) {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, material.normalTexture.texture);
      } else {
        gl.bindTexture(gl.TEXTURE_2D, material.normalTexture.texture);
      }
      // Tell the shader we bound the texture to texture unit 1
      gl.uniform1i(material.uniformLocation.normalSampler, 1);
    }

    // Render to the buffer
    {
      const offset = 0;
      const type = gl.UNSIGNED_SHORT;
      gl.drawElements(gl.TRIANGLES, this.indicesCount, type, offset);
    }
  }
}
