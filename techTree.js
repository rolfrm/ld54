
class TechNode{
    constructor(name, requirements){
        this.name = name;
        this.requirements = []
        this.pos = (0,0);
        this.cost = 0;
        this.unlocks = []
    }
    isSatisifed(setOfNodes){
        for(let req of this.requirements){
            if(!(setOfNodes.has(req))){
                return false;
            }
        }
        return true;
    }
}

class TechTree{
    constructor(nodes){
        this.allNodes = nodes
        this.acquiredNodes = new Map();
    }

    AcquireTech(node){
        this.acquiredNodes.set(node, true)
    }

    GetAvailableNodes(){
        let result = []
        for(let node of this.allNodes){
            
            if(!this.acquiredNodes.has(node) && node.isSatisifed(this.acquiredNodes)){
                result.push(node);
            }
                
            continue;
        }
        return result;
    }
}

function GameTech(){
    const everything = Object.assign(new TechNode, {name: "Everything", requirements: [], cost: 10, pos: [-5,0], unlocks: ["*"]});
    const coal1 = Object.assign(new TechNode, {name: "Coal 1", requirements: [], cost: 0, pos: [0,0], unlocks: ["Coal 1"]});
    const coal2 = Object.assign(new TechNode, {name: "Coal 2", requirements: [coal1], cost: 100, pos: [1,0], unlocks: ["Coal 2"]});
    const materialPhysics = Object.assign(new TechNode, {name: "Material Physics", requirements: [coal2], cost: 100, pos: [1,1], unlocks: []});
    const coal3 = Object.assign(new TechNode, {name: "Coal 3", requirements: [coal2, materialPhysics], cost: 200, pos: [2,1], unlocks: ["Coal 3"]});
    const wind = Object.assign(new TechNode, {name: "Wind 1", requirements: [coal1], cost: 100, pos: [1,-1], unlocks: ["Wind Mill 1"]});
    const wind2 = Object.assign(new TechNode, {name: "Wind 2", requirements: [wind, materialPhysics], cost: 200, pos: [2,-1], unlocks: ["Wind Mill 2"]});
    const wind3 = Object.assign(new TechNode, {name: "Wind 3", requirements: [wind2], cost: 400, pos: [3,-1], unlocks: ["Wind Mill 3"]});
    const semiConductor = Object.assign(new TechNode, {name: "Semi Conductor", requirements: [materialPhysics], cost: 400, pos: [3,1]});
    const solarCells = Object.assign(new TechNode, {name: "Solar", requirements: [semiConductor], cost: 400, pos: [4,2], unlocks: ["Solar Panels 1"]});
    const solarCells2 = Object.assign(new TechNode, {name: "Solar 2", requirements: [solarCells], cost: 800, pos: [5,2], unlocks: ["Solar Panels 2"]});
    const ecology1 = Object.assign(new TechNode, {name: "Ecology 1", requirements: [coal1], cost: 50, pos: [0,3], unlocks: ["Tree 1"]});
    const ecology2 = Object.assign(new TechNode, {name: "Ecology 2", requirements: [ecology1], cost: 100, pos: [1,3], unlocks: ["Tree 2"]});
    const ecology3 = Object.assign(new TechNode, {name: "Ecology 3", requirements: [ecology2], cost: 200, pos: [2,3], unlocks: ["Tree 3"]});
    const fusion1 = Object.assign(new TechNode, {name: "Fusion 1", requirements: [solarCells], cost: 1000, pos: [4,4], unlocks: ["Fusion Plant 1"]});
    const fusion2 = Object.assign(new TechNode, {name: "Fusion 2", requirements: [fusion1], cost: 2000, pos: [5,4], unlocks: ["Fusion Plant 2"]});
    const fusion3 = Object.assign(new TechNode, {name: "Fusion 3", requirements: [fusion2], cost: 4000, pos: [6,4], unlocks: ["Fusion Plant 3"]});
    const production1 = Object.assign(new TechNode, {name: "Production 1", requirements: [coal1], cost: 200, pos: [1,5], unlocks: ["Factory 1"]});
    const capture1 = Object.assign(new TechNode, {name: "Carbon Capture", requirements: [semiConductor], cost: 1000, pos: [2,6], unlocks: ["Capture 1"]});
    const capture2 = Object.assign(new TechNode, {name: "Carbon Capture 2", requirements: [capture1], cost: 10000, pos: [3,6], unlocks: ["Capture 2"]});

    return new TechTree([everything, coal1, coal2, materialPhysics, coal3, wind, wind2, wind3, 
        semiConductor, solarCells, solarCells2, ecology1, ecology2, ecology3, capture1, capture2,
    fusion1, fusion2, fusion3, production1]);


}

export{TechTree, TechNode, GameTech}