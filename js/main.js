$(function() {

  var TIMELINE_PAD = 50;
  var DEFAULT_WAYNE_SIZE = 48;
  
  var RENDER_TIME = 24;

  var scene = new THREE.Scene();
  var camera;

  var timeline = $('.timeline');
  var wayneMarker = $('.wayne-marker');

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

    timeline.css('left', TIMELINE_PAD + 'px');
    timeline.css('width', window.innerWidth - TIMELINE_PAD * 2);

    wayneMarker.css('top', '-' + DEFAULT_WAYNE_SIZE / 2 + 'px');
  }
  resetRendererSize();

	document.body.appendChild(renderer.domElement);

  var light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);

  var hemilight = new THREE.HemisphereLight(0xaaaaff, 0x000000, 5.0);
  scene.add(hemilight);

  var backToYou = new Audio('media/back_to_you.mp3');
  backToYou.preload = 'auto';
  backToYou.loop = true;
  backToYou.autoplay = true;

  var wayne;
  makeWayne(function(mesh) {
    wayne = mesh;
    scene.add(wayne);
  });

  var mouseState = {};

  var active = {idle: false};

  $(window).resize(resetRendererSize);
  $('body').mousemove(function(e) {
    mouse(e.pageX, e.pageY);
  });

  function start() {
    render();

    setTimeout(function() {
      active.idle = true;
    }, 500);
  }
  start();

  function render() {
    window.requestAnimationFrame(render, RENDER_TIME);

    updateWayneMarker();

    if (active.idle) idleWayne();

    renderer.render(scene, camera);
  }

  function makeWayne(callback) {
    var loader = new THREE.JSONLoader;

    loader.load('models/wayne.js', function (geometry, materials) {
      var mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
      
      var scale = 3;
      mesh.scale.set(scale, scale, scale);

      mesh.position.set(0, 1, -0.25);

      mesh.rotation.x = 1.2;

      callback(mesh);
    });
  }

  function mouse(x, y) {
    if (mouseState.x) {
      wayne.rotation.y += (x - mouseState.x) / 100;
      wayne.rotation.x += (y - mouseState.y) / 50;
    }

    mouseState.x = x;
    mouseState.y = y;
  }

  function updateWayneMarker() {
    if (!backToYou.duration) return;

    var end = timeline.width();
    var fraction = backToYou.currentTime / backToYou.duration;
    var position = fraction * end;

    wayneMarker.animate({
      left: position + 'px'
    }, RENDER_TIME);
  }

  function idleWayne() {
    if (!wayne) return;

    var rapping = backToYou.currentTime > 31.7;

    if (rapping) wayne.rotation.y += 0.005;

    var fraction = backToYou.currentTime / backToYou.duration;

    var scale = 3 + 4 * fraction;
    wayne.scale.set(scale, scale, scale);

    var scalar = (rapping)? 0.17 * fraction : 0.0;

    var vertices = wayne.geometry.vertices;
    for (var i = 0; i < 10; i++) {
      var index = Math.floor(Math.random() * vertices.length);
      
      vertices[index].x += pneg() * scalar;
      vertices[index].y += pneg() * scalar;
      vertices[index].z += pneg() * scalar;
    }

    wayne.geometry.verticesNeedUpdate = true;
  }

  function pneg() {
    return Math.random() - 0.5;
  }

});
