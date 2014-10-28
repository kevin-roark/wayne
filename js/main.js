$(function() {

  var scene = new THREE.Scene();
  var camera;

  var renderer;
  var rendermode = 'webgl';
  try {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1);
  } catch(e) {
    console.log('f u');
  }

  function resetRendererSize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, 1, 3000);
    camera.position.set(0, 0, 10);
  }
  resetRendererSize();
  $(window).resize(resetRendererSize);

	document.body.appendChild(renderer.domElement);

  var wayne = makeWayne();
  scene.add(wayne);

  function start() {
    render();
  }
  start();

  function render() {
    window.requestAnimationFrame(render, 20);

    renderer.render(scene, camera);
  }

  function makeWayne() {
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    var geometry = new THREE.BoxGeometry(2, 2, 2);

    var mesh = new THREE.Mesh(geometry);
    
    return mesh;
  }


});
