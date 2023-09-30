import * as THREE from 'three';
import { WorldSimulator } from 'worldsim';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MapControls } from 'three/addons/controls/MapControls.js';
import * as GUI from 'datgui';
import { GraphicalModel } from './graphicalModel.js';


const loader = new THREE.TextureLoader();
const bmlloader = new THREE.ImageBitmapLoader();
const gltfLoader = new GLTFLoader();


function getTextureData(texture) {
	// Assuming you have a texture named 'yourTexture' in your scene

	var image = texture;

	// Create a canvas element to draw the image
	var canvas = document.createElement('canvas');
	canvas.width = image.width;
	canvas.height = image.height;

	var context = canvas.getContext('2d');
	context.drawImage(image, 0, 0);

	// Get the image data from the canvas
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

	// Now 'imageData' contains the pixel data of the texture
	return imageData;

}
function bitmapLoaded(bmp){
	let imageData = getTextureData(bmp);
	let w = imageData.width;
	let h = imageData.width;
	let wh = w * h;
	let channels = imageData.data.length / wh;
	for(let i = 0; i < h; i++){
		for(let j = 0; j < w; j++){
			let index = channels * (i * w + j);
			const height = imageData.data[index + 1 ] / 256.0;
			const geometry = new THREE.BoxGeometry( 1, height * 10.0, 1 );

			const cube = new THREE.Mesh( geometry, material );
			cube.position.x = i - h / 2;
			cube.position.z = j - w / 2;
			cube.position.y = height * 5;
			scene.add( cube );
			cube.castShadow = true;
			cube.receiveShadow = true;
			cube.box = true;
			
		}
	}
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

let windMill_model = GraphicalModel.Load('assets/windmill.gltf')
windMill_model.scale = 0.2;
let scaling = 0.2 / 0.5;
windMill_model.offset = new THREE.Vector3(1.2 * scaling,1.2 * scaling,-0.2 * scaling) ;

let coalPower_model = GraphicalModel.Load('assets/smoke.gltf')
coalPower_model.scale = 0.4;
coalPower_model.offset = new THREE.Vector3(-0.4,0.45,-0.35);

let tree_model = GraphicalModel.Load('assets/tree.gltf')
tree_model.scale = 0.25;
tree_model.offset = new THREE.Vector3(-0.1,0.5,-0.1);


let placeModel = null;
let placeModelInstance = null;
let mixers = [];
gltfLoader.load( 'assets/windmill.gltf', function ( gltf ) {
	let model = gltf.scene;
	model.castShadow = true;
	model.receiveShadow = true;
	model.position.y = 8;
	model.position.z = -2;
	model.children.forEach((child) => {
		child.castShadow = true;
		child.receiveShadow = true;
	});

	let mixer = new THREE.AnimationMixer(gltf.scene)
	mixers.push(mixer);

	mixer.clipAction(gltf.animations[0].clone()).play();
	mixer.clipAction(gltf.animations[1].clone()).play();
	
	model.scale.set(0.5, 0.5, 0.5);
	scene.add( model );
} );


const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 30;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.01, 1000 );

const mapPng = bmlloader.load('assets/map1-64x64.png', bitmapLoaded);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const material = new THREE.MeshStandardMaterial( { color: 0x00ffff } );


const waterGeometry = new THREE.BoxGeometry( 100, 0.1, 100 );
const waterMaterial = new THREE.MeshStandardMaterial( { color: 0x444444 } );
waterMaterial.opacity = 0.75;
waterMaterial.transparent = true;
const water = new THREE.Mesh(waterGeometry, waterMaterial);

scene.add( water );




// light
const directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.6 );
directionalLight.position.set( 10, 10, 32 );
directionalLight.lookAt(new THREE.Vector3(0,0,0))
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 8;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.left = -30;
directionalLight.shadow.camera.top	= 30;
directionalLight.shadow.camera.bottom = -30;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.radius = 1.0;
directionalLight.shadow.bias = -0.0005;

scene.add( directionalLight );

const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.5 );
//ambientLight.position.set( 10, -10, 10 );
scene.add( ambientLight );

//document.body.appendChild( effect.domElement );

camera.position.y = 100;
camera.lookAt(new THREE.Vector3(100,0,100));
camera.position.z = -10;
camera.position.x = -10;

const controls = new MapControls( camera, renderer.domElement );
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

//controls.minDistance = 100;
//controls.maxDistance = 500;

controls.maxPolarAngle = Math.PI / 2;

// GUI
let gui_model = {
	
}

function setPlaceModel(model){
	if(placeModel != null){
		scene.remove(placeModelInstance	.model);
	}
	placeModel = model;
	if(model == null){
		placeModelInstance = null;
	}else{
		placeModelInstance = model.CreateInstance();
		scene.add(placeModelInstance.model);
	}
}

gui_model['Coal Plant'] = function(){
	setPlaceModel(coalPower_model);
};
gui_model['Wind Mill'] = function(){
	setPlaceModel(windMill_model);
};
gui_model['Solar Cells'] = function(){

};
gui_model['Tree'] = function(){
	setPlaceModel(tree_model);
};
const gui = new GUI.GUI()

const cubeFolder = gui.addFolder('Build')
cubeFolder.add(gui_model, "Wind Mill");
cubeFolder.add(gui_model, "Coal Plant");
cubeFolder.add(gui_model, "Solar Cells");
cubeFolder.add(gui_model, "Tree");
cubeFolder.open()


function onDocumentMouseDown( event ) {
	if (event.target.localName != "canvas") {
        return;
    }
	event.preventDefault();
	if(placeModel != null){
		let newModel = placeModel.CreateInstance();
		newModel.model.position.x =placeModelInstance.model.position.x;
		newModel.model.position.y =placeModelInstance.model.position.y;
		newModel.model.position.z =placeModelInstance.model.position.z;
		scene.add(newModel.model);
		mixers.push(newModel.mixer);
		setPlaceModel(null);
	}
  
  }

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    

let sim = new WorldSimulator(64, 64, {});
const clock = new THREE.Clock();

function animate(time) {

	raycaster.setFromCamera( pointer, camera );
	
	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
	let dist = 10000.0;
	if(placeModelInstance != null){
		for(let intersect of intersects){
			if(intersect.object.box != true)
				continue;
			if(intersect.object == placeModelInstance.model)
				continue;
			if(intersect.distance > dist) continue;
			dist = intersect.distance;
			let v = intersect.point;
			placeModelInstance.model.position.set(Math.round(v.x), v.y, Math.round(v.z));
		}
	}
	

	let delta = clock.getDelta();
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	water.position.y = Math.sin(time * 0.002) * 0.2 + 4;
	mixers.forEach((mixer) => mixer.update(delta))
	
	controls.update();
	//directionalLight.position.set( Math.sin(time * 0.002) * 32, Math.cos(time * 0.002) * 32, 20 );
	directionalLight.lookAt(new THREE.Vector3(0,0,0))
	
	sim.timestep(time, []);
}
window.addEventListener( 'pointermove', onPointerMove );

function onDocumentKeyDown(event) {
    var keyCode = event.which;
	
    // up
    if (keyCode == 27) {
		setPlaceModel(null);
	}
}

document.addEventListener("keydown", onDocumentKeyDown, false);


animate(0.0);