import p5 from 'p5';

import Person from "./person";

export default p => {
    let people = [];
    let dead = [];
    let inputLabelY = 210;

    const genPeople = () => {
        people = [];
        dead = [];
        for (let i = 0; i < 99; i++) {
            people.push(new Person(null, i));
        }
        people.push(new Person(new Date(), 99));
    };

    const createInputLabel = (desc, initialVal) => {
        const input = p.createInput();
        input.attribute('type', 'number');
        input.position(10, inputLabelY);
        input.value(initialVal);
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

        genPeople();

        const [maxSpawnVelLabel, maxSpawnVelInput] = createInputLabel('Max spawn velocity', 3);
        const [borderWindThresholdLabel, borderWindThresholdInput] = createInputLabel('Border wind threshold', .3);
        const [borderWindStrengthLabel, borderWindStrengthInput] = createInputLabel('Border wind strength', 100);
        const [separationThresholdLabel, separationThresholdInput] = createInputLabel('Separation threshold', 50);
        const [separationStrengthLabel, separationStrengthInput] = createInputLabel('Separation strength', 10);
        const [alignmentThresholdLabel, alignmentThresholdInput] = createInputLabel('Alignment threshold', 40);
        const [alignmentStrengthLabel, alignmentStrengthInput] = createInputLabel('Alignment strength', .3);
        const [cohesionThresholdLabel, cohesionThresholdInput] = createInputLabel('Cohesion threshold', 40);
        const [cohesionStrengthLabel, cohesionStrengthInput] = createInputLabel('Cohesion strength', .02);
        const [speedLimitLabel, speedLimitInput] = createInputLabel('Speed limit', 4);
        const [recoveryTimeLabel, recoveryTimeInput] = createInputLabel('Recovery time', 5000);
        const [transmissionRateLabel, transmissionRateInput] = createInputLabel('Transmission rate', 100);
        const [deathRateLabel, deathRateInput] = createInputLabel('Death rate', .0001);
        const restartButton = p.createButton('Restart Simulation');
        restartButton.position(10, inputLabelY);
        restartButton.mousePressed(genPeople);
    };

    const update = () => {
        for (let person of people) {
            if (person.update(people.filter(v => v !== person))) {
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
