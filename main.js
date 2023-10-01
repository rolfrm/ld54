import * as THREE from 'three';
import { WorldSimulator } from 'worldsim';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MapControls } from 'three/addons/controls/MapControls.js';
//import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline/THREE.meshline.js';
import * as GUI from 'datgui';
import { GraphicalModel } from './graphicalModel.js';
import { GameTech } from './techTree.js';
import { getSimModels } from './worldsimModels.js';


let level = [];

const techTree = GameTech();	
for(let techNode of techTree.allNodes){
	if(techNode.cost == 0){
		techTree.AcquireTech(techNode);
	}
}
const simModels = getSimModels();

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
	for(let y = 0; y < h; y++){
		for(let x = 0; x < w; x++){
			let index = channels * (y * w + x);
			const height = imageData.data[index + 1 ] / 256.0;
			const geometry = new THREE.BoxGeometry( 1, height * 10.0, 1 );

			const cube = new THREE.Mesh( geometry, material );
			cube.position.x = y - h / 2;
			cube.position.z = x - w / 2;
			cube.position.y = height * 5;
			scene.add( cube );
			cube.castShadow = true;
			cube.receiveShadow = true;
			cube.box = true;
		}
	}
	// load level 1
	fetch("assets/level1.json").then((code) => {
		code.json().then((j) => loadFromJson(j));
	})
}

// for raycasting into the scene.
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

let windMill_model = GraphicalModel.Load('assets/windmill.gltf', 'Wind Mill 1')

windMill_model.scale = 0.2;
let scaling = 0.2 / 0.5;
windMill_model.offset = new THREE.Vector3(1.2 * scaling,1.2 * scaling,-0.2 * scaling) ;

let windMill2_model = GraphicalModel.Load('assets/windmill2.gltf', 'Wind Mill 2')

let coalPower_model = GraphicalModel.Load('assets/smoke.gltf', 'Coal 1')
coalPower_model.scale = 0.4;
coalPower_model.offset = new THREE.Vector3(-0.4,0.45,-0.35);

let coalPower2_model = GraphicalModel.Load('assets/smoke.gltf', 'Coal 2')
coalPower2_model.scale = 0.4;
coalPower2_model.offset = new THREE.Vector3(-0.4,0.45,-0.35);


let tree_model = GraphicalModel.Load('assets/tree.gltf', 'Tree 1')
tree_model.scale = 0.25;
tree_model.offset = new THREE.Vector3(-0.1,0.5,-0.1);

let town_model = GraphicalModel.Load('assets/town.gltf', 'Town 1')
town_model.scale = 0.3;
//town_model.offset = new THREE.Vector3(-0.1,0.5,-0.1);
let city_model = GraphicalModel.Load('assets/city.gltf', 'City 1')
city_model.scale = 0.5;

let progress_model = GraphicalModel.Load('assets/progressbar.gltf', 'Progress 1')
//progress_model.scale = 0.25;
progress_model.offset = new THREE.Vector3(0,5,0);


let game_models = [windMill_model, windMill2_model, coalPower_model, coalPower2_model, tree_model, town_model, city_model, progress_model];
for(let model of game_models){
	
	model.tech = simModels[model.name];
}
let placeModel = null;
let placeModelInstance = null;

function setPlaceModel(model){
	if(placeModel != null){
		scene.remove(placeModelInstance.model);
	}
	placeModel = model;
	if(model == null){
		placeModelInstance = null;
	}else{
		placeModelInstance = model.CreateInstance();
		scene.add(placeModelInstance.model);
	}
}

let mixers = [];

const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 30;
const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.01, 1000 );

bmlloader.load('assets/map1-64x64.png', bitmapLoaded);

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
const buildingsNode = new THREE.Mesh();
scene.add(buildingsNode);
const techTreeUi = new THREE.Mesh();
const nodeMaterial = new THREE.MeshStandardMaterial( { color: 0x222222 } );
const selectedNodeMaterial = new THREE.MeshStandardMaterial( { color: 0x66FF66 } );
const availableNodeMaterial = new THREE.MeshStandardMaterial( { color: 0xFFFF44 } );
const acquiredTechMaterial = new THREE.MeshStandardMaterial( { color: 0x666666 } );
let highLightedNode = null;
scene.add(techTreeUi);
{
	for (const tech of techTree.allNodes) {
		let cube = new THREE.BoxGeometry(1, 1, 1);
		
		
		
		
		const matLine = new THREE.LineBasicMaterial( {

			color: 0xFF00000, 
			dashed: false,
			alphaToCoverage: true,

		} );



		let nodeUi = new THREE.Mesh(cube, nodeMaterial);
		nodeUi.tech = tech;
		nodeUi.position.x = tech.pos[0] * 1.1;
		nodeUi.position.z = tech.pos[1] * 1.1;
		nodeUi.position.y = 20;

		for (const req of tech.requirements) {
			let start = new THREE.Vector3(req.pos[0] * 1.1, 20, req.pos[1] * 1.1);
			const points = [];
			points.push( nodeUi.position.clone() );
			points.push( start);

			const geometry = new THREE.BufferGeometry().setFromPoints( points );

			const line = new THREE.Line( geometry, matLine );
			
			techTreeUi.add(line);
		}
		nodeUi.is_tech_node = true;
		
		techTreeUi.add(nodeUi);
	}
	techTreeUi.is_tech_node = true;
}

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
	Money: 1000,
	CO2: 500,
	Temperature: 0.0,
	Production: 0,
	"Water Level": 0,
	Capacity: 0,
	Storage: 0,
	Consumption: 0,
	Wind: 0

}

for(let x of game_models){
	gui_model[x.name] = function(){
		setPlaceModel(x);
	};	
}

const gui = new GUI.GUI()

const cubeFolder = gui.addFolder('Build')
for(let x of game_models){
	cubeFolder.add(gui_model, x.name);

}
cubeFolder.open()
const techFolder = gui.addFolder('Tech')

const statsFolder = gui.addFolder('Stats');

let views = []
function addView(name){
	views.push(statsFolder.add(gui_model, name))
}
for(name of ["Money", "CO2", "Temperature", "Water Level", "Production", "Storage", "Capacity", "Consumption", "Wind"]){
	addView(name)
}
statsFolder.open()
const gameStorageKey = "saveGame";

const gameFolder = gui.addFolder('Game');
function addGameFunction(name, fcn){
    gui_model[name] = fcn;
	gameFolder.add(gui_model, name);
}
addGameFunction("Save", ()=> {
	let json = saveToGameStateToJson();
	
	localStorage.setItem(gameStorageKey, json);
});

addGameFunction("Save To Clipboard", ()=> {
	let json = saveToGameStateToJson();
	navigator.clipboard.writeText(json);
	console.log("game state saved to clipboard");
});

function saveToGameStateToJson(){
	let gameData = {level: level.map((x)=> ({typeName: x.type.name, position: x.position})), 
		tech: Array.from(techTree.acquiredNodes.keys()).map((x) => x.name)};
	return JSON.stringify(gameData);
}

function loadFromJsonString(json){
	let loaded = JSON.parse(json);
	return loadFromJson(loaded);
}

function loadFromJson(loaded){
	
	level = loaded.level;
	buildingsNode.clear();
	mixers = []
	let lookup = {}
	let typeLookup = {}
	for(let model of game_models){
		lookup[model.name] = model;
		typeLookup[model.name] = model.tech;
	}
	for(let x of level){
		x.type = typeLookup[x.typeName];
		let type = x.type;
		let pos = x.position;
		let model = lookup[type.name];
		let instance = model.CreateInstance();
		instance.model.position.set(pos.x, pos.y, pos.z);
		buildingsNode.add(instance.model);
		mixers.push(instance.mixer);
	}
}

addGameFunction("Load", ()=>{
	let savedGame = localStorage.getItem(gameStorageKey);
	if(savedGame == null) return;
	loadFromJsonString(savedGame);
});

function placeBuilding(placeModel, position){
	let newModel = placeModel.CreateInstance();
	newModel.model.position.set(position.x, position.y, position.z);

	level.push({
		type: placeModel.tech,
		position: newModel.model.position
	});

	buildingsNode.add(newModel.model);
	mixers.push(newModel.mixer);
}

function onDocumentMouseDown( event ) {
	if (event.target.localName != "canvas") {
        return;
    }


	event.preventDefault();
	if(highLightedNode != null){
		//techFolder.clear();
		if(techFolder.clear != undefined){
			techFolder.clear();
		}
		let a = techFolder.add(highLightedNode, "name")
		let b = techFolder.add(highLightedNode, "cost")
		techFolder.clear = () => {
			techFolder.remove(a);
			techFolder.remove(b);
		}
		//alert("Tech node clicked!");
		return;
	}
	if(placeModel != null){
		placeBuilding(placeModel, placeModelInstance.model.position);
		if(!event.shiftKey){
			setPlaceModel(null);
		}
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
	let availableTech = techTree.GetAvailableNodes();
	for (let techNode of techTreeUi.children){
		if(availableTech.includes(techNode.tech)){
			techNode.material = availableNodeMaterial;
		}else if(techTree.acquiredNodes.has(techNode.tech)){
			techNode.material = acquiredTechMaterial;
		}else{
			techNode.material = nodeMaterial;
		}
	}
	highLightedNode = null;
	for(let intersect of intersects){
		if(intersect.object.is_tech_node == true){
			intersect.object.material = selectedNodeMaterial;
			highLightedNode = intersect.object.tech;
			
			break;
		}
	}
	
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
	gui_model.CO2 = sim.adjustedCo2Level;
	gui_model.Temperature = sim.temperatureRise.amount
	gui_model['Water Level'] = sim.waterRise.amount;
	gui_model['Production'] = sim.production;
	gui_model['Consumption'] = sim.consumption;
	gui_model['Wind'] = sim.wind;
	gui_model.Money = sim.funds;
	for(let view of views){
		view.updateDisplay();
	}
	

	let delta = clock.getDelta();
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	water.position.y = sim.waterLevel;
	
	mixers.forEach((mixer) => mixer.update(delta))
	
	controls.update();
	//directionalLight.position.set( Math.sin(time * 0.002) * 32, Math.cos(time * 0.002) * 32, 20 );
	directionalLight.lookAt(new THREE.Vector3(0,0,0))
	
	sim.timestep(time, level);
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