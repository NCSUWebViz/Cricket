
var globe;
var renderer;
var sceneScreen;
var camera;

$(document).ready(function() {
	var geometry, materialScreen, mesh;
	
	var container = document.getElementById('container');
	var w = container.offsetWidth || window.innerWidth;
	var h = container.offsetHeight || window.innerHeight;
	
	/*renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.autoClear = false;
    renderer.setClearColorHex(0x000000, 0.0);
    renderer.setSize(w, h);
	renderer.domElement.style.position = 'absolute';*/
	//container.appendChild(renderer.domElement);
	
	sceneScreen = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 30, w/h, 1, 10000);
	camera.position.z = 1000;
	
	var rtTexture = new THREE.WebGLRenderTarget(w, h,
        	{ minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );
			
    var materialScreen = new THREE.ShaderMaterial( {
		uniforms: { tDiffuse: { type: "t", value: 0, texture: rtTexture } },
		vertexShader: document.getElementById( 'vertex_shader' ).textContent,
		fragmentShader: document.getElementById( 'fragment_shader_screen' ).textContent,
		depthWrite: false
	});
	var material2 = new THREE.MeshLambertMaterial( { color: 0xffffff, map: rtTexture } );
	var plane = new THREE.PlaneGeometry( w, h );
	var quad = new THREE.Mesh( plane, material2 );
	quad.position.z = -500;
	sceneScreen.add( quad );
	
	
	globe = new DAT.Globe(container, null, rtTexture, true);
	renderer = globe.renderer;
	animate();
	loadTeams();
	
	
	/*$.getJSON('testdata/stats.json', function(data) {
		return;
		for (i=0;i<data.length;i++) {
        	globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true, models: data[i][2]});
      	}
		console.log("loaded!");
	});*/
});

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	globe.render();
	camera.lookAt(sceneScreen.position);
	renderer.render(sceneScreen, camera);
}

function loadTeams() {
	$.getJSON('php/getTeams.php', function(data) {
		var teamItems = [];
  		$.each(data, function(key, val) {
    		teamItems.push('<li id="' + val.code + '">' + val.name + '</li>');
  		});

  		$('<ul/>', {
    		'class': 'teamList',
   			html: teamItems.join('')
  		}).appendTo('body');
	});
}