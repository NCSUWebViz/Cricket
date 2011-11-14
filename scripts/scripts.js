
var globe;
var renderer;
var projector;
var sceneScreen;
var camera;
var rtTexture;
var dynamicTexture;
var teamHighlightMeshes = new Array();

$(document).ready(function() {
    var geometry, materialScreen, mesh;
    var container = document.getElementById('container');
    var w = container.offsetWidth || window.innerWidth;
    var h = container.offsetHeight || window.innerHeight;
    $(container).click(teamGlobeClickTest);
    projector = new THREE.Projector();
    /*renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.autoClear = false;
    renderer.setClearColorHex(0x000000, 0.0);
    renderer.setSize(w, h);
    renderer.domElement.style.position = 'absolute';
    container.appendChild(renderer.domElement);

    sceneScreen = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 30, w/h, 1, 10000);
    camera.position.z = 1000;

    rtTexture = new THREE.WebGLRenderTarget(w, h,
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
    sceneScreen.add( quad );*/

    loadTeams();
    loadGlobe();
});

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    globe.render();
    //camera.lookAt(sceneScreen.position);
    //renderer.render(sceneScreen, camera);
    //renderer.render(sceneScreen, globe.camera);
}

function loadGlobe() {
    globe = new DAT.Globe(container, null, null, false, null);
    renderer = globe.renderer;
    animate();
    //loadOtherTexture();
}

function loadTeams() {
    console.log("Load teams called");
    $.getJSON('php/getTeams.php', function(data) {
        var teamItems = [];
        var $ul = $('<ul/>', {
            'class': 'teamList',
        });
        $.each(data, function(key, val) {
            var $team = $('<li id="' + val.code + '">' + val.name + '</li>')
                .appendTo($ul);
            $team.addClass('team');
            $team.data('lat', val.latitude);
            $team.data('lng', val.longitude);
            addTeam(val.latitude, val.longitude);
            $team.hover(function() {
                var $this = $(this);
                globe.curLat = $this.data('lat');
                globe.curLong = $this.data('lng');
            });
        });
        $ul.appendTo('body');
        console.log("load Teams attempted");
    });
}

function addTeam(lat, lng) {
    var mesh = globe.addHighlight(lat, lng, null);
    teamHighlightMeshes.push(mesh);
}

function teamGlobeClickTest(event) {
    var x = ( event.clientX / window.innerWidth ) * 2 - 1;
    var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    var vector = new THREE.Vector3( x, y, 0.5 );
    projector.unprojectVector( vector, globe.camera );
    var ray = new THREE.Ray( globe.camera.position,
            vector.subSelf( globe.camera.position ).normalize() );
    var hits = ray.intersectObjects(teamHighlightMeshes);
    if (hits.length) {
        console.log("Team Location clicked!", hits);
    } else {
        console.log("Click detected, but no target was hit.");
    }
}

/*function loadOtherTexture() {
    var worldImg = document.getElementById('fakeImage');
    var queue = html2canvas.Parse(worldImg, {});
    var canvas = html2canvas.Renderer(queue);
    console.log(canvas);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    rtTexture = texture;
    var material = new THREE.MeshBasicMaterial({
        map : texture
    });
    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = -10;
    //sceneScreen.add(mesh);
}*/

function loadOtherTexture() {
    var worldImg = document.getElementById('worldImg');
    var canvas;
    var preload = html2canvas.Preload(worldImg, {
        "images": [worldImg],
        "complete": function(images){
            console.log("Preload complete:", images);
            var queue = html2canvas.Parse(worldImg, images);
            canvas = html2canvas.Renderer(queue);
            console.log("Canvas:", canvas);

            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            dynamicTexture = texture;
            //rtTexture = texture;

            //var material = new THREE.MeshBasicMaterial({
                //map : texture
            //});
            //var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
            //mesh.position.z = -500;
            //sceneScreen.add(mesh);

            //globe = new DAT.Globe(container, null, rtTexture, true,
            //globe = new DAT.Globe(container, null, null, true,
                //dynamicTexture);
            globe = new DAT.Globe(container, null, null, false, null);
            renderer = globe.renderer;
            animate();
        }
    });
}

