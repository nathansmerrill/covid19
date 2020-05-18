import Person from "./person";
import Vector from "./vector";
import {BORDER_WIND_STRENGTH} from "./config";

export default p => {
    let people = [];
    let dead = [];
    let inputLabelY = 210;
    let inputDefaultVals = [];
    let maxSpawnVelLabel, maxSpawnVelInput, borderWindThresholdLabel, borderWindThresholdInput,
        borderWindStrengthLabel, borderWindStrengthInput, startingInfectedLabel, startingInfectedInput,
        separationThresholdLabel, separationThresholdInput, separationStrengthLabel, separationStrengthInput,
        alignmentThresholdLabel, alignmentThresholdInput, alignmentStrengthLabel, alignmentStrengthInput,
        cohesionThresholdLabel, cohesionThresholdInput, cohesionStrengthLabel, cohesionStrengthInput,
        speedLimitLabel, speedLimitInput, recoveryTimeLabel, recoveryTimeInput,
        transmissionRateLabel, transmissionRateInput, deathRateLabel, deathRateInput;

    let borderWindThreshold, separationThreshold, separationStrength,
        alignmentThreshold, alignmentStrength, cohesionThreshold, cohesionStrength,
        speedLimit, recoveryTime, transmissionRate, deathRate,
        leftWind, rightWind, topWind, bottomWind;

    const genWinds = borderWindStrength => {
        console.log(`Generating winds ${borderWindStrength}`);
        leftWind = new Vector(borderWindStrength, 0);
        rightWind = new Vector(-borderWindStrength, 0);
        topWind = new Vector(0, borderWindStrength);
        bottomWind = new Vector(0, -borderWindStrength);
    };

    const genPeople = () => {
        people = [];
        dead = [];
        const startingInfected = startingInfectedInput.value();
        const maxSpawnVel = maxSpawnVelInput.value();
        for (let i = 0; i < 100 - startingInfected; i++) {
            people.push(new Person(null, maxSpawnVel, i));
        }
        for (let i = 0; i < startingInfected; i++) {
            people.push(new Person(new Date(), maxSpawnVel, 99));
        }
    };

    const createInputLabel = (desc, initialVal, setVarFunc = null) => {
        const input = p.createInput();
        input.attribute('type', 'number');
        input.position(10, inputLabelY);
        input.value(initialVal);
        if (setVarFunc) {
            setVarFunc(initialVal);
            input.input(() => setVarFunc(input.value()));
        }
        inputDefaultVals.push([input, initialVal]);
        const label = p.createElement('label', desc);
        label.position(80, inputLabelY);
        inputLabelY += 30;
        return [label, input];
    };

    p.windowResized = () => {
        p.resizeCanvas(innerWidth, innerHeight);
    };

    p.setup = () => {
        p.createCanvas(innerWidth, innerHeight);

        [maxSpawnVelLabel, maxSpawnVelInput] = createInputLabel('Max spawn velocity', 3);
        [startingInfectedLabel, startingInfectedInput] = createInputLabel('Starting infected', 1);
        [borderWindThresholdLabel, borderWindThresholdInput] = createInputLabel('Border wind threshold', 100, val => borderWindThreshold = val);
        [borderWindStrengthLabel, borderWindStrengthInput] = createInputLabel('Border wind strength', .3, val => genWinds(val));
        borderWindStrengthInput.attribute('disabled', 'true');
        [separationThresholdLabel, separationThresholdInput] = createInputLabel('Separation threshold', 50, val => separationThreshold = val);
        [separationStrengthLabel, separationStrengthInput] = createInputLabel('Separation strength', 10, val => separationStrength = val);
        [alignmentThresholdLabel, alignmentThresholdInput] = createInputLabel('Alignment threshold', 40, val => alignmentThreshold = val);
        [alignmentStrengthLabel, alignmentStrengthInput] = createInputLabel('Alignment strength', .3, val => alignmentStrength = val);
        [cohesionThresholdLabel, cohesionThresholdInput] = createInputLabel('Cohesion threshold', 40, val => cohesionThreshold = val);
        [cohesionStrengthLabel, cohesionStrengthInput] = createInputLabel('Cohesion strength', .02, val => cohesionStrength = val);
        [speedLimitLabel, speedLimitInput] = createInputLabel('Speed limit', 4, val => speedLimit = val);
        [recoveryTimeLabel, recoveryTimeInput] = createInputLabel('Recovery time', 5000, val => recoveryTime = val);
        // [transmissionRateLabel, transmissionRateInput] = createInputLabel('Transmission rate', 'f(dist) = 4/dist', val => transmissionRate = val);
        [deathRateLabel, deathRateInput] = createInputLabel('Death rate', .0001, val => deathRate = val);

        const resetButton = p.createButton('Reset configuration');
        resetButton.position(10, inputLabelY);
        resetButton.mousePressed(() => {
            console.log(inputDefaultVals);
            for (let input of inputDefaultVals) {
                input[0].value(input[1]);
            }
        });
        inputLabelY += 30;
        const restartButton = p.createButton('Restart Simulation');
        restartButton.position(10, inputLabelY);
        restartButton.mousePressed(genPeople);

        genPeople();
    };

    const update = () => {
        // const borderWindThreshold = borderWindThresholdInput.value();
        // const deathRate = deathRateInput.value();
        // const recoveryTime = recoveryTimeInput.value();
        // const separationThreshold = separationThresholdInput.value();
        // const separationStrength = separationStrengthInput.value();
        // const alignmentThreshold = alignmentThresholdInput.value();
        // const alignmentStrength = alignmentStrengthInput.value();
        // const cohesionThreshold = cohesionThresholdInput.value();
        // const cohesionStrength = cohesionStrengthInput.value();
        // const speedLimit = speedLimitInput.value();
        for (let person of people) {
            if (person.update(people.filter(v => v !== person), deathRate, recoveryTime, borderWindThreshold,
                leftWind, rightWind, topWind, bottomWind, separationThreshold, separationStrength,
                alignmentThreshold, alignmentStrength, cohesionThreshold, cohesionStrength, speedLimit)) {
            // if (person.update(people.filter(v => v !== person), 0.0001, 5000, 100, leftWind, rightWind, topWind, bottomWind, 50, 10, 40, .3, 40, .02, 4)) {
                dead.push(person.pos);
                people = people.filter(v => v !== person);
            }
        }
        for (let person of people) {
            person.move();
        }
    };

    p.draw = () => {
        update();
        p.clear();

        let healthyCount = 0;
        let infectedCount = 0;
        let recoveredCount = 0;

        p.fill(0);
        for (let person of dead) {
            p.circle(person.x, person.y, 15);
        }
        for (let person of people) {
            person.draw(p);
            if (person.infected) {
                infectedCount++;
            } else if (person.wasInfected) {
                recoveredCount++;
            } else {
                healthyCount++;
            }
        }
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(40);
        p.fill(170, 198, 202);
        p.text(`Healthy: ${healthyCount}`, 10, 10);
        p.fill(255, 0, 0);
        p.text(`Infected: ${infectedCount}`, 10, 60);
        p.fill(203, 30, 218);
        p.text(`Recovered: ${recoveredCount}`, 10, 110);
        p.fill(0);
        p.text(`Dead: ${dead.length}`, 10, 160);
    };
};
