import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

const gltfLoader = new GLTFLoader();
class GraphicalModel {
    
    static Load(asset, name){
        let modelBase = new GraphicalModel ()
        modelBase.name = name;
        modelBase.model = null;
        modelBase.animations = [];
        modelBase.ready = false;
        gltfLoader.load( asset, function ( gltf ) {
            let model = gltf.scene;
            model.castShadow = true;
            model.receiveShadow = true;
            
            model.traverse((child) => {
                if(child.isMesh){
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
              })
              
            modelBase.animations = gltf.animations;
            modelBase.model = model;
            modelBase.ready = true;
        });

        modelBase.scale = 1.0;
        modelBase.offset = new THREE.Vector3(0,0,0);
        return modelBase;
    }

    CreateInstance(){
        let model2 = this.model.clone();
        let mixer = new THREE.AnimationMixer(model2)
        
        this.animations.forEach((anim) => {
            mixer.clipAction(anim).play();
        });
        model2.scale.set(this.scale, this.scale, this.scale);
        model2.position.x += this.offset.x;
        model2.position.y += this.offset.y;
        model2.position.z += this.offset.z;
        let outer = new THREE.Mesh();
        outer.add(model2);
        
        return new GraphicalModelInstance(outer, mixer);
    }

}

class GraphicalModelInstance{
    constructor(model, mixer){
        this.model = model;
        this.mixer = mixer;
    }
}

export { GraphicalModel, GraphicalModelInstance };