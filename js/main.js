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

	document.body.appendChild(renderer.domElement);

  var backToYou = new Audio('media/back_to_you.mp3');
  backToYou.preload = 'auto';
  backToYou.loop = true;
  backToYou.autoplay = true;

  var wayne = makeWayne();
  scene.add(wayne);

  var mouseState = {};

  $(window).resize(resetRendererSize);
  $('body').mousemove(function(e) {
    mouse(e.pageX, e.pageY);
  });

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

    var size = 4;
    var geometry = new THREE.BoxGeometry(size, size, size);

    var mesh = new THREE.Mesh(geometry);
    
    return mesh;
  }

  function mouse(x, y) {
    if (mouseState.x) {
      wayne.rotation.y += (x - mouseState.x) / 250;
      wayne.rotation.x += (y - mouseState.y) / 240;
    }

    mouseState.x = x;
    mouseState.y = y;
  }


});
