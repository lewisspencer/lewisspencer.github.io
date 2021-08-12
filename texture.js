class Texture {
  texture;
  isCubeMap;

  constructor(texture, isCubeMap) {
    this.texture = texture;
    this.isCubeMap = isCubeMap;
  }
}

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([255, 255, 255, 255]); // opaque white
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      console.log("Texture %s supports mipmapping", url);
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      console.log("Texture %s supports linear filtering", url);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    // Check if the browser support anistoropic filtering
    // if so set the max level for the texture
    var ext =
      gl.getExtension("EXT_texture_filter_anisotropic") ||
      gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
      gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
    if (ext) {
      var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      console.log("Texture %s supports anisotropy %d", url, max);
      gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
    }
  };
  image.src = url;

  return new Texture(texture, false);
}

function loadCubemapTexture(gl, urls) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  for (let i = 0; i < 6; i++) {
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 255, 255, 255]); // opaque white
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );

    const image = new Image();
    image.onload = function () {
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
      );
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        console.log("Texture %s supports mipmapping", urls[i]);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        console.log("Texture %s supports linear filtering", urls[i]);
        gl.texParameteri(
          gl.TEXTURE_CUBE_MAP,
          gl.TEXTURE_WRAP_S,
          gl.CLAMP_TO_EDGE
        );
        gl.texParameteri(
          gl.TEXTURE_CUBE_MAP,
          gl.TEXTURE_WRAP_T,
          gl.CLAMP_TO_EDGE
        );
        gl.texParameteri(
          gl.TEXTURE_CUBE_MAP,
          gl.TEXTURE_WRAP_R,
          gl.CLAMP_TO_EDGE
        );
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      }
    };
    image.src = urls[i];
  }

  return new Texture(texture, true);
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
