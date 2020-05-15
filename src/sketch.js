import Person from "./person";

let people = [];
let dead = [];

export function windowResized() {
    resizeCanvas(innerWidth, innerHeight);
}

export function setup() {
    createCanvas(innerWidth, innerHeight);

    for (let i = 0; i < 99; i++) {
        people.push(new Person(null, i));
    }
    people.push(new Person(new Date(), 99));
}

function update() {
    for (let person of people) {
        if (person.update(people.filter(v => v !== person))) {
            dead.push(person.pos);
            people = people.filter(v => v !== person);
        }
    }
    for (let person of people) {
        person.move();
    }
}

export function draw() {
    update();
    clear();

    let healthyCount = 0;
    let infectedCount = 0;
    let recoveredCount = 0;

    fill(0);
    for (let person of dead) {
        circle(person.x, person.y, 15);
    }
    for (let person of people) {
        person.draw();
        if (person.infected) {
            infectedCount++;
        } else if (person.wasInfected) {
            recoveredCount++;
        } else {
            healthyCount++;
        }
    }
    textAlign(LEFT, TOP);
    textSize(40);
    fill(170, 198, 202);
    text(`Healthy: ${healthyCount}`, 10, 10);
    fill(255, 0, 0);
    text(`Infected: ${infectedCount}`, 10, 60);
    fill(203, 30, 218);
    text(`Recovered: ${recoveredCount}`, 10, 110);
    fill(0);
    text(`Dead: ${dead.length}`, 10, 160);
}
