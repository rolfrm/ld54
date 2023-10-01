
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
        this.variable = false;
        this.maintainance = 0;
    }
}

function getSimModels(){
    let town = {name: "Town 1", consumption: 1.0, revenue: 1, cost: 20.0, emission: 1.0};
    let city = {name: "City 1", consumption: 10.0, revenue: 4, cost: 200.0, emission: 8.0};
    let coalPlant1 = {name: "Coal 1", production: 10.0, cost: 10.0,  emission: 10.0, variable: true};
    let coalPlant2 = {name: "Coal 2", production: 30.0, cost: 20.0,  emission: 39.0, variable: true};

    let capture1 = {name: "Carbon Capture 1", production: 0.0, cost: 200.0, consumption: 300,  emission: -2.0, maintainance: 100};
    let capture2 = {name: "Carbon Capture 2", production: 0.0, cost: 1000.0, consumption: 3000,  emission: -100.0, maintainance: 1000};


    let windmill1 = {name: "Wind Mill 1", production: 5.0, cost: 50.0, emission: 0.0, windDriven: true};
    let windmill2 = {name: "Wind Mill 2", production: 15.0, cost: 100.0, emission: 0.0, windDriven: true};
    let tree = {name: "Tree 1", production: 0.0, cost: 1.0, reduction: 10.0, emission: -0.05};
    let tree2 = {name: "Tree 2", production: 0.0, cost: 10.0, reduction: 20.0, emission: -0.13};
    let tree3 = {name: "Tree 3", production: 0.0, cost: 200.0, reduction: 400.0, emission: -0.39};

    let solar = {name: "Solar Panels 1", cost: 10.0, production: 6.0, sunDriven: true};
    let solar2 = {name: "Solar Panels 2",  cost: 30.0, production: 30.0, sunDriven: true};
    
    let fusion1 = {name: "Fusion Plant 1", production: 20.0, cost: 300.0};
    let fusion2 = {name: "Fusion Plant 2", production: 60.0, cost: 1000.0};
    let fusion3 = {name: "Fusion Plant 3", production: 10000.0, cost: 10000.0};
    let factory = {name: "Factory 1", production: 0.0, emission: 2.0, revenue: 5, consumption: 20, cost: 100.0};

    let result = [town, city, coalPlant1, windmill1, windmill2, coalPlant2, tree, tree2, tree3, capture1, capture2,
        solar, solar2, fusion1,  fusion2, fusion3, factory]
        .map((item) => Object.assign(new SimModel, item))
    let resultObject = {};
    for(let r of result){
        resultObject[r.name] = r;
    }
    return resultObject;

}

export {getSimModels}