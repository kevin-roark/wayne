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
    window.requestAnimationFrame(render, RENDER_TIME);

    updateWayneMarker();

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

  function updateWayneMarker() {
    if (!backToYou.duration) return;

    var end = timeline.width();
    var fraction = backToYou.currentTime / backToYou.duration;
    var position = fraction * end;

    wayneMarker.animate({
      left: position + 'px'
    }, RENDER_TIME);
  }

});
