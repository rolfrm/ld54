class Parameters {
    secondsPerHour = 1.0;

    startingWaterLevel = 4;

    startingFunds = 1000.0;
    income = 10.0;
};

function clamp(x, min, max) {
    return Math.max(Math.min(x, max), min);
}

class Pollution {
    amount = 0.0;

    #baseRise = 0.0;
    #baseLowering = 0.0;

    #min = 0.0;
    #max = 1.0;

    step(delta, emission) {
        this.amount = clamp(this.amount + (this.#baseRise + emission) * delta - this.#baseLowering * delta, this.#min, this.#max);
    }

    constructor(baseAmount, baseRise, baseLowering, min, max) {
        this.amount = baseAmount;

        this.#baseRise = baseRise;
        this.#baseLowering = baseLowering;

        this.#min = min;
        this.#max = max;
    }
};

class WorldSimulator {
    // Private stuff
    #secondsPerHour = 0;
    #startWaterLevel = 0;

    // Absolute time
    #lastDay = 0;
    #lastHour = 0;

    // General parameters
    /// Economy
    funds = 0.0;
    income = 10.0;

    /// Environment
    waterLevel = 0.0;
    temperatureRise = null;
    co2Level = null;
    wind = 0.0;

    constructor(width, height, simParameters) {
        this.#secondsPerHour = simParameters.secondsPerHour ?? 1.0;

        this.funds = simParameters.startingFunds ?? 0.0;
        this.income = simParameters.income ?? 1.0;

        this.#startWaterLevel = simParameters.startingWaterLevel ?? 4;
        this.co2Level = new Pollution(300, 0.1, 0.2, 300, 1000);
        this.temperatureRise = new Pollution(0, 0.1, 0.1, 0, 10);
        this.waterRise = new Pollution(0, 0, 0.1, 0, 100);
    };

    #co2LevelToTempRise(level) {
        return (level - 450) / 100;
    }

    #newHour(day, hour, constructions) {
        let hourDiff = (day * 24 + hour) - (this.#lastDay * 24 + this.#lastHour);

        this.#lastDay = day;
        this.#lastHour = hour;

        // Update stuff
        this.funds += this.income * hourDiff;

        // CO2 + Temperature + Water level
        this.co2Level.step(hourDiff, 0);

        const tempRise = this.#co2LevelToTempRise(this.co2Level.amount);
        this.temperatureRise.step(hourDiff, tempRise);
        
        this.waterRise.step(hourDiff, this.temperatureRise.amount);
        this.waterLevel = this.#startWaterLevel + this.waterRise.amount;

        // Wind
        this.wind = this.wind * 0.5+ Math.pow(Math.random(), 3) * 0.5;

        console.log(this.co2Level.amount, this.temperatureRise.amount, this.waterLevel);
    }

    timestep(absTime, constructions) {
        let hourTime = Math.round(absTime / (1000 * this.#secondsPerHour));

        let day = Math.round(hourTime / 24);
        let hour = Math.round(hourTime - day * 24);

        let update = (day != this.#lastDay) || (hour != this.#lastHour);

        if (update) {
            this.#newHour(day, hour, constructions);
        }
    }
};

export { WorldSimulator, Parameters };
