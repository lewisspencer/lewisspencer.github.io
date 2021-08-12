var createPerspectiveCamera = require("pex-cam/perspective");
var createOrbiter = require("pex-cam/orbiter");

main();

function main() {
  const gl = createWebGLCanvas();
  if (gl === null) {
    console.log(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  var actors = [
    new RotatingCube(gl),
    new RotatingCube(gl),
    new StaticCube(gl),
    new SkyBox(gl),
  ];
  actors[0].position = [-2, 0, 0];
  actors[1].position = [2, 0, 0];
  actors[2].position = [0, -3, 0];
  actors[2].scale = [10, 0.2, 10];
  actors[3].scale = [1000, 1000, 1000];

  var camera = createPerspectiveCamera({
    position: [0, 0, 5],
    target: [0, 0, 0],
    up: [0, 1, 0],
    fov: (45 * Math.PI) / 180,
    aspect: gl.canvas.clientWidth / gl.canvas.clientHeight,
    near: 0.1,
    far: 10000,
  });

  var orbiter = createOrbiter({
    camera: camera,
    element: gl.canvas,
    easing: 0.1,
    drag: true,
    zoom: true,
    pan: true,
  });

  // Draw the scene repeatedly
  var then = 0;
  function render(now) {
    now *= 0.001; // Convert to seconds
    const deltaTime = now - then;
    then = now;

    // Update all actors first
    for (let actor of actors) {
      actor.tick(deltaTime);
    }

    clearScene(gl);
    for (let actor of actors) {
      actor.draw(gl, camera.projectionMatrix, camera.viewMatrix);
    }
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
