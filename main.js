import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry( 1, 10, 10 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ffff } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// light
const directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.6 );
directionalLight.position.set( 10, -10, 10 );
scene.add( directionalLight );

const effect = new AsciiEffect( renderer, ' .:-+*=%@#', { invert: true } );
effect.setSize( window.innerWidth, window.innerHeight );
effect.domElement.style.color = 'white';
effect.domElement.style.backgroundColor = 'black';
//document.body.appendChild( effect.domElement );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
	//effect.render( scene, camera );
}

animate();