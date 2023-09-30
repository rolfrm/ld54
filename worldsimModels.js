
class SimModel{

}

function getSimModels(){
    let town = {name: "Town", consumption: 1.0, cost: 20.0};
    let city = {name: "City", consumption: 10.0, cost: 200.0};
    let coalPlant1 = {name: "Power Plant 1", production: 10.0, cost: 10.0,  emission: 10.0};
    let windmill1 = {name: "Wind Mill 1", production: 1.0, cost: 4.0, emission: 0.0};
    return [town, city, coalPlant1, windmill1].map((item) => Object.assign(new SimModel, item))
}

export {getSimModels}