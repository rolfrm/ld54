import * as THREE from 'three';
import { WorldSimulator } from 'worldsim';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MapControls } from 'three/addons/controls/MapControls.js';
import * as GUI from 'datgui';


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
			const height = imageData.data[4 * (i * w + j + 1)] / 256.0;
			const geometry = new THREE.BoxGeometry( 1, height * 10.0, 1 );

			const cube = new THREE.Mesh( geometry, material );
			cube.position.x = i - h / 2;
			cube.position.z = j - w / 2;
			cube.position.y = height * 5;
			scene.add( cube );
			cube.castShadow = true;
			cube.receiveShadow = true;
			
		}
	}
}

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

	let model2 = model.clone();
	scene.add(model2);
	model2.position.z -= 5;
	model2.position.y += 1;

	mixer = new THREE.AnimationMixer(model2)
	mixers.push(mixer);

	mixer.clipAction(gltf.animations[0]).play();
	mixer.clipAction(gltf.animations[1]).play();
	
	model2 = model.clone();
	scene.add(model2);
	model2.position.z -= 8;
	model2.position.y += 1.8;
	mixer = new THREE.AnimationMixer(model2)
	mixers.push(mixer);

	mixer.clipAction(gltf.animations[0]).play();
	mixer.clipAction(gltf.animations[1]).play();
	
	

} );


const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 30;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );

const mapPng = bmlloader.load('assets/map1-64x64.png', bitmapLoaded);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const material = new THREE.MeshStandardMaterial( { color: 0x00ffff } );


const waterGeometry = new THREE.BoxGeometry( 100, 0.1, 100 );
const waterMaterial = new THREE.MeshStandardMaterial( { color: 0x4444FF } );
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

camera.position.y = 10;
camera.lookAt(new THREE.Vector3(10,0,10));
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
gui_model['Coal Plant'] = function(){
	
};
gui_model['Wind Mill'] = function(){

};
gui_model['Solar Cells'] = function(){

};
const gui = new GUI.GUI()
const cubeFolder = gui.addFolder('Build')
cubeFolder.add(gui_model, "Wind Mill");
cubeFolder.add(gui_model, "Coal Plant");
cubeFolder.add(gui_model, "Solar Cells");
cubeFolder.open()
//


let sim = new WorldSimulator(64, 64, {});
const clock = new THREE.Clock();

function animate(time) {
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

animate(0.0);