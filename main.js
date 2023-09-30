import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';

const loader = new THREE.TextureLoader();
const displacement = loader.load('assets/map1-64x64.png');

const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 30;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );


const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 64, 1, 64 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ffff } );

const cube = new THREE.Mesh( geometry, material );

scene.add( cube );
const geometry2 = new THREE.BoxGeometry( 32, 2, 32 );
const material2 = new THREE.MeshStandardMaterial( { color: 0xffff66 } );

const cube2 = new THREE.Mesh( geometry2, material2 );

scene.add( cube2 );
const geometry3 = new THREE.BoxGeometry( 20, 3, 20 );
const material3 = new THREE.MeshStandardMaterial( { color: 0x44ff44 } );

const cube3 = new THREE.Mesh( geometry3, material3 );
scene.add( cube3 );

const geometry4 = new THREE.CylinderGeometry(0.3, 0.3, 6);
const material4 = new THREE.MeshStandardMaterial( { color: 0xDDDDDD } );

const cube4 = new THREE.Mesh( geometry4, material4 );
cube4.position.y = 4.2;
cube4.castShadow = true;



scene.add( cube4 );




const waterGeometry = new THREE.BoxGeometry( 100, 0.1, 100 );
const waterMaterial = new THREE.MeshStandardMaterial( { color: 0x4444FF } );
waterMaterial.opacity = 0.75;
waterMaterial.transparent = true;
const water = new THREE.Mesh(waterGeometry, waterMaterial);

scene.add( water );

cube3.castShadow = true;
cube2.castShadow = true;
cube.castShadow = true;
cube3.receiveShadow = true;
cube2.receiveShadow = true;
cube.receiveShadow = true;




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
let time = 0.0;
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	water.position.y = Math.sin(time * 0.2) * 1.0 + 0.5;
	time += 0.1;

	directionalLight.position.set( Math.sin(time * 0.2) * 32, Math.cos(time * 0.2) * 32, 20 );
	directionalLight.lookAt(new THREE.Vector3(0,0,0))
	


}

animate();