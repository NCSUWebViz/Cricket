/**
 * dat.globe Javascript WebGL Globe Toolkit
 * http://dataarts.github.com/dat.globe
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
 
 /*
 * Note: this file has been modified from its original form (code submissions
 * will be made later.  Modifications:
 * - a few updates to make this project work with the latest THREE git checkout.
 * - curLat and curLong latitude and longitude setting variables (reads are there
 * but may be buggy)
 * - a mechanism to render to a THREE RenderTarget (render to texture, effectively)
 * - a quirky bug fix thrown in to invert mouse up and down movement interpretation,
 * since apparently THREE has a bug that inverts textures, which requires an upside
 * down texture, plus the controls hack.
 */

var DAT = DAT || {};

DAT.Globe = function(container, colorFn, renderTargetTexture, swapUpDown, dynamicTexture) {

  colorFn = colorFn || function(x) {
    var c = new THREE.Color();
    c.setHSV( ( 0.6 - ( x * 0.5 ) ), 1.0, 1.0 );
    return c;
  };
  
  var swapUpDown = swapUpDown || false;

  var Shaders = {
    'earth' : {
      uniforms: {
        'texture': { type: 't', value: 0, texture: null }
      },
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          'vNormal = normalize( normalMatrix * normal );',
          'vUv = uv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D texture;',
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'vec3 diffuse = texture2D( texture, vUv ).xyz;',
          'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
          'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
          'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
        '}'
      ].join('\n')
    },
    'atmosphere' : {
      uniforms: {},
      vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'vNormal = normalize( normalMatrix * normal );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
          'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
        '}'
      ].join('\n')
    }
  };

  var camera, scene, sceneAtmosphere, renderer, w, h;
  var vector, mesh, atmosphere, point;
  var models;

  var overRenderer;

  //var imgDir = 'globe/';
  var imgDir = 'images/';

  var curZoomSpeed = 0;
  var zoomSpeed = 50;

  var THREE_VERSION_OFFSET = Math.PI;
  var mouse = { x: 0, y: 0 }, mouseOnDown = { x: 0, y: 0 };
  var rotation = { x: 0, y: 0 },
      target = { x: Math.PI*3/2 + THREE_VERSION_OFFSET, y: Math.PI / 6.0 },
      //target = { x: Math.PI*3/2, y: Math.PI / 6.0 },
      targetOnDown = { x: 0, y: 0 };

  var distance = 100000, distanceTarget = 100000;
  var padding = 40;
  var PI_HALF = Math.PI / 2;
  var TWO_PI = 2*Math.PI;

  function init() {

    container.style.color = '#fff';
    container.style.font = '13px/20px Arial, sans-serif';

    var shader, uniforms, material;
    w = container.offsetWidth || window.innerWidth;
    h = container.offsetHeight || window.innerHeight;

    //camera = new THREE.Camera(
	camera = new THREE.PerspectiveCamera(
        30, w / h, 1, 10000);
    camera.position.z = distance;

    vector = new THREE.Vector3();

    scene = new THREE.Scene();
    sceneAtmosphere = new THREE.Scene();

    //var geometry = new THREE.Sphere(200, 40, 30);
	var geometry = new THREE.SphereGeometry(200, 40, 30);

    shader = Shaders['earth'];
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms['texture'].texture = dynamicTexture ||
        THREE.ImageUtils.loadTexture(imgDir+'world'+'.jpg');
    //uniforms['texture'].texture = THREE.ImageUtils.loadTexture(imgDir+'world_upsidedown'+'.jpg');

    //material = new THREE.MeshShaderMaterial({
	material = new THREE.ShaderMaterial({

          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader

        });

    mesh = new THREE.Mesh(geometry, material);
    mesh.matrixAutoUpdate = false;
    //scene.addObject(mesh);
	scene.add(mesh);

    shader = Shaders['atmosphere'];
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    //material = new THREE.MeshShaderMaterial({
	material = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader

        });

    mesh = new THREE.Mesh(geometry, material);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.1;
    mesh.flipSided = true;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    //sceneAtmosphere.addObject(mesh);
	sceneAtmosphere.add(mesh);

    //geometry = new THREE.Cube(0.75, 0.75, 1, 1, 1, 1, null, false, { px: true,
	geometry = new THREE.CubeGeometry(0.75, 0.75, 1, 1, 1, 1, null, false, { px: true,
          nx: true, py: true, ny: true, pz: false, nz: true});

    for (var i = 0; i < geometry.vertices.length; i++) {

      var vertex = geometry.vertices[i];
      vertex.position.z += 0.5;

    }

    point = new THREE.Mesh(geometry);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.autoClear = false;
    renderer.setClearColorHex(0x000000, 0.0);
    renderer.setSize(w, h);

    renderer.domElement.style.position = 'absolute';

    container.appendChild(renderer.domElement);

    container.addEventListener('mousedown', onMouseDown, false);

    container.addEventListener('mousewheel', onMouseWheel, false);

    document.addEventListener('keydown', onDocumentKeyDown, false);

    window.addEventListener('resize', onWindowResize, false);

    container.addEventListener('mouseover', function() {
      overRenderer = true;
    }, false);

    container.addEventListener('mouseout', function() {
      overRenderer = false;
    }, false);
  }

  addData = function(data, opts) {
    var lat, lng, size, color, i, step, colorFnWrapper;

    opts.animated = opts.animated || false;
    this.is_animated = opts.animated;
    opts.format = opts.format || 'magnitude'; // other option is 'legend'
    if (opts.format === 'magnitude') {
      step = 3;
      colorFnWrapper = function(data, i) { return colorFn(data[i+2]); }
    } else if (opts.format === 'legend') {
      step = 4;
      colorFnWrapper = function(data, i) { return colorFn(data[i+3]); }
    } else {
      throw('error: format not supported: '+opts.format);
    }

    if (opts.models) {
        //models = Array(opts.models);
        //console.log("Models:", models, typeof models);
        //for (var item in opts.models) {
            //console.log("Model:", opts.models[item]);
        //}
        for (i = 0; i < opts.models.length; i++) {
            var _model = opts.models[i];
            var loader = new THREE.JSONLoader();
            loader.load( { model: _model,
                callback: addModelFromLoader(lat, lng, size, color) } );
        }
        for (i = 0; i  < data.length; i += step) {
            var loader = new THREE.JSONLoader();
            //loader.load( { model: "models/captain_blender.js",
                //callback: createScene1 } );
            lat = data[i];
            lng = data[i + 1];
            color = colorFnWrapper(data,i);
            size = data[i + 2];
            loader.load( { model: "models/first_try_smaller.js",
            //loader.load( { model: "models/captain_blender.js",
                callback: addModelFromLoader(lat, lng, size, color) } );
        }
    } else {
        if (opts.animated) {
            if (this._baseGeometry === undefined) {
                this._baseGeometry = new THREE.Geometry();
                for (i = 0; i < data.length; i += step) {
                    lat = data[i];
                    lng = data[i + 1];
                    //size = data[i + 2];
                    color = colorFnWrapper(data,i);
                    size = 0;
                    addPoint(lat, lng, size, color, this._baseGeometry);
                }
            }
            if(this._morphTargetId === undefined) {
                this._morphTargetId = 0;
            } else {
                this._morphTargetId += 1;
            }
            opts.name = opts.name || 'morphTarget'+this._morphTargetId;
        }
        var subgeo = new THREE.Geometry();
        for (i = 0; i < data.length; i += step) {
          lat = data[i];
          lng = data[i + 1];
          color = colorFnWrapper(data,i);
          size = data[i + 2];
          size = size*200;
          addPoint(lat, lng, size, color, subgeo);
        }
        if (opts.animated) {
          this._baseGeometry.morphTargets.push({'name': opts.name, vertices: subgeo.vertices});
        } else {
          this._baseGeometry = subgeo;
        }
    }

  };

  function addHighlight(lat, lng, material) {
    var geometry = new THREE.CubeGeometry(0.75, 0.75, 1, 1, 1, 1, null, false, { px: true,
          nx: true, py: true, ny: true, pz: false, nz: true});

    for (var i = 0; i < geometry.vertices.length; i++) {

      var vertex = geometry.vertices[i];
      vertex.position.z += 0.5;

    }


    var phi = (90 - lat) * Math.PI / 180;
    var theta = (180 - lng) * Math.PI / 180 + THREE_VERSION_OFFSET;
    //var theta = (180 - lng) * Math.PI / 180 + Math.PI;

    var point = new THREE.Mesh(geometry,
            material || new THREE.MeshBasicMaterial({
              color: 0xffffff,
              vertexColors: THREE.FaceColors,
              morphTargets: false
            }));
    point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
    point.position.y = 200 * Math.cos(phi);
    point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

    point.lookAt(mesh.position);
    point.scale.z = 1;
    point.scale.x = 8;
    point.scale.y = 8;
    point.updateMatrix();
    scene.add(point);
    return point
  }

  function addModelFromLoader(lat, lng, size, color) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (180 - lng) * Math.PI / 180;
    return function (geometry) {
        geometry.materials[0][0].shading = THREE.FlatShading;
        var material = [
            new THREE.MeshFaceMaterial(),
            new THREE.MeshLambertMaterial({
                color: 0xffffff,
                opacity:0.9,
                shading:THREE.FlatShading,
                wireframe: true,
                wireframeLinewidth: 2
        })];

        geometry.computeBoundingBox();
        var height = geometry.boundingBox.y[1] - geometry.boundingBox.y[0];
        var mesh2 = new THREE.Mesh( geometry, material );
        mesh2.position.y = 200 * Math.cos(phi);
        mesh2.position.z = 200 * Math.sin(phi) * Math.sin(theta);
        mesh2.scale.x = mesh2.scale.y = mesh2.scale.z = size*10000;
        mesh2.position.x = 200 * Math.sin(phi) * Math.cos(theta) + height*mesh2.scale.y/2 + 2;
        mesh2.lookAt(mesh2.position);
        mesh2.rotation.z = -phi;
        mesh2.rotation.y = -theta;
        mesh2.updateMatrix();
        scene.add( mesh2 );
    }
  }

  function createPoints() {
    if (this._baseGeometry !== undefined) {
      if (this.is_animated === false) {
        this.points = new THREE.Mesh(this._baseGeometry,
            new THREE.MeshBasicMaterial({
              color: 0xffffff,
              vertexColors: THREE.FaceColors,
              morphTargets: false
            }));
      } else {
        if (this._baseGeometry.morphTargets.length < 8) {
          console.log('t l',this._baseGeometry.morphTargets.length);
          var padding = 8-this._baseGeometry.morphTargets.length;
          console.log('padding', padding);
          for(var i=0; i<=padding; i++) {
            console.log('padding',i);
            this._baseGeometry.morphTargets.push({'name': 'morphPadding'+i, vertices: this._baseGeometry.vertices});
          }
        }
        this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
              color: 0xffffff,
              vertexColors: THREE.FaceColors,
              morphTargets: true
            }));
      }
      scene.addObject(this.points);
    }
  }

  function addPoint(lat, lng, size, color, subgeo) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (180 - lng) * Math.PI / 180;

    point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
    point.position.y = 200 * Math.cos(phi);
    point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

    point.lookAt(mesh.position);

    point.scale.z = -size;
    point.updateMatrix();

    var i;
    for (i = 0; i < point.geometry.faces.length; i++) {

      point.geometry.faces[i].color = color;

    }

    //GeometryUtils.merge(subgeo, point);
  }

  function onMouseDown(event) {
    event.preventDefault();

    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mouseup', onMouseUp, false);
    container.addEventListener('mouseout', onMouseOut, false);

    mouseOnDown.x = - event.clientX;
    mouseOnDown.y = event.clientY;

    targetOnDown.x = target.x;
    targetOnDown.y = target.y;

    container.style.cursor = 'move';
  }

  function onMouseMove(event) {
    mouse.x = - event.clientX;
    mouse.y = event.clientY;

    var zoomDamp = distance/1000;

    target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
    if (swapUpDown)
        target.y = targetOnDown.y - (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;
    else
        target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

    target.y = target.y > PI_HALF ? PI_HALF : target.y;
    target.y = target.y < - PI_HALF ? - PI_HALF : target.y;
  }

  function onMouseUp(event) {
    container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
    container.style.cursor = 'auto';
  }

  function onMouseOut(event) {
    container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
  }

  function onMouseWheel(event) {
    event.preventDefault();
    if (overRenderer) {
      zoom(event.wheelDeltaY * 0.3);
    }
    return false;
  }

  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 38:
        zoom(100);
        event.preventDefault();
        break;
      case 40:
        zoom(-100);
        event.preventDefault();
        break;
    }
  }

  function onWindowResize( event ) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function zoom(delta) {
    distanceTarget -= delta;
    distanceTarget = distanceTarget > 1000 ? 1000 : distanceTarget;
    distanceTarget = distanceTarget < 350 ? 350 : distanceTarget;
  }

  function animate() {
    //console.log("Animating!");
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    zoom(curZoomSpeed);

    rotation.x += (target.x - rotation.x) * 0.1;
    rotation.y += (target.y - rotation.y) * 0.1;

    distance += (distanceTarget - distance) * 0.3;

    camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
    camera.position.y = distance * Math.sin(rotation.y);
    camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

    vector.copy(camera.position);

    camera.lookAt(scene.position);
    renderer.clear();
    //renderer.render(scene, camera);
    renderer.render(sceneAtmosphere, camera);
	//renderer.render(sceneAtmosphere, camera, renderTargetTexture, true);
    renderer.render(scene, camera, renderTargetTexture, true);
	//renderer.render(sceneAtmosphere, camera, renderTargetTexture, true);
  }

  init();
  this.animate = animate;

  this.__defineGetter__('curLat', function() {
    var phi = Math.acos(target.y/200);
    var lat = 90 - (phi / Math.PI * 180);
    console.log("curLat getter:", lat);
    return lat;
  });

  this.__defineSetter__('curLat', function(lat) {
    var phi = (lat) * Math.PI / 180;
    target.y = phi;
    this._curLat = lat
  });

  this.__defineGetter__('curLong', function() {
    var phi = (90 - this.curLat) * Math.PI / 180;
    var theta = Math.acos(target.x / 200 / Math.sin(phi));
    var lng = 180 - (theta * 180 / Math.PI);
    console.log("curLong getter:", lng);
    return lng;
  });

  this.__defineSetter__('curLong', function(lng) {
    var theta = (180 - lng) * Math.PI / 180;
    //var newRot = (-theta - 3*Math.PI/2) % (TWO_PI);
    var newRot = (-theta - 3*Math.PI/2 + THREE_VERSION_OFFSET) % (TWO_PI);
    var numRots = Math.floor(target.x / (TWO_PI)) + 1;
    var newTargetX = numRots * TWO_PI + newRot;
    target.x = newTargetX;
    this._curLong = lng
  });

  this.__defineGetter__('time', function() {
    return this._time || 0;
  });

  this.__defineSetter__('time', function(t) {
    var validMorphs = [];
    if (this.points === undefined)
      return;
    var morphDict = this.points.smorphTargetDictionary;
    for(var k in morphDict) {
      if(k.indexOf('morphPadding') < 0) {
        console.log("Morphdict:", morphDict[k]);
        validMorphs.push(morphDict[k]);
      }
    }
    validMorphs.sort();
    var l = validMorphs.length-1;
    var scaledt = t*l+1;
    var index = Math.floor(scaledt);
    for (i=0;i<validMorphs.length;i++) {
      this.points.morphTargetInfluences[validMorphs[i]] = 0;
    }
    var lastIndex = index - 1;
    var leftover = scaledt - index;
    if (lastIndex >= 0) {
      this.points.morphTargetInfluences[lastIndex] = 1 - leftover;
    }
    this.points.morphTargetInfluences[index] = leftover;
    this._time = t;
  });

  this.addData = addData;
  this.addHighlight = addHighlight;
  this.createPoints = createPoints;
  this.renderer = renderer;
  this.scene = scene;
  this.render = render;
  this.camera = camera;

  return this;

};

