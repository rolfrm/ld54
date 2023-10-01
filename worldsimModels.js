
class SimModel{
    constructor(){
        this.name = "";
        this.consumption = 0.0;
        this.cost = 0.0;
        this.emission = 0.0;
        this.production = 0.0;
        this.reduction = 0.0;
        this.revenue = 0.0;
        this.windDriven = false;
    }
}

function getSimModels(){
    let town = {name: "Town 1", consumption: 1.0, revenue: 1, cost: 20.0, emission: 1.0};
    let city = {name: "City 1", consumption: 10.0, revenue: 4, cost: 200.0, emission: 8.0};
    let coalPlant1 = {name: "Coal 1", production: 10.0, cost: 10.0,  emission: 10.0};
    let coalPlant2 = {name: "Coal 2", production: 20.0, cost: 15.0,  emission: 19.0};
    let windmill1 = {name: "Wind Mill 1", production: 1.0, cost: 4.0, emission: 0.0, windDriven: true};
    let windmill2 = {name: "Wind Mill 2", production: 4.0, cost: 8.0, emission: 0.0, windDriven: true};
    let tree = {name: "Tree 1", production: 0.0, cost: 1.0, reduction: 1.0, emission: -0.5};
    let tree2 = {name: "Tree 2", production: 0.0, cost: 4.0, reduction: 5.0, emission: -1.3};
    let tree3 = {name: "Tree 3", production: 0.0, cost: 20.0, reduction: 40.0, emission: -3.9};

    let solar = {name: "Solar Panels 1", production: 0.0, cost: 10.0, production: 6.0, sunDriven: true};

    let result = [town, city, coalPlant1, windmill1, windmill2, coalPlant2, tree, tree2, tree3, solar]
        .map((item) => Object.assign(new SimModel, item))
    let resultObject = {};
    for(let r of result){
        resultObject[r.name] = r;
    }
    return resultObject;

}

export {getSimModels}