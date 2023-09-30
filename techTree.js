
class TechNode{
    constructor(name, requirements){
        this.name = name;
        this.requirements = []
        this.pos = (0,0);
        this.cost = 0;
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
    const coal1 = Object.assign(new TechNode, {name: "Coal 1", requirements: [], cost: 0, pos: [0,0]});
    const coal2 = Object.assign(new TechNode, {name: "Coal 2", requirements: [coal1], cost: 100, pos: [1,0]});
    const materialPhysics = Object.assign(new TechNode, {name: "Coal 2", requirements: [coal2], cost: 100, pos: [1,1]});
    const coal3 = Object.assign(new TechNode, {name: "Coal 3", requirements: [coal2, materialPhysics], cost: 200, pos: [2,1]});
    const wind = Object.assign(new TechNode, {name: "Wind 1", requirements: [coal1], cost: 100, pos: [1,-1]});
    const wind2 = Object.assign(new TechNode, {name: "Wind 2", requirements: [wind], cost: 200, pos: [2,-1]});
    const wind3 = Object.assign(new TechNode, {name: "Wind 3", requirements: [wind2], cost: 400, pos: [3,-1]});
    const semiConductor = Object.assign(new TechNode, {name: "Semi Conductor", requirements: [materialPhysics], cost: 400, pos: [3,1]});
    const solarCells = Object.assign(new TechNode, {name: "Solar", requirements: [semiConductor], cost: 400, pos: [4,2]});

    return new TechTree([coal1, coal2, materialPhysics, coal3, wind, wind2, wind3, semiConductor, solarCells]);


}

export{TechTree, TechNode, GameTech}