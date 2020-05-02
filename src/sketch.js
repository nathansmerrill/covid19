import Person from "./person";

let people = [];

export function windowResized() {
    resizeCanvas(innerWidth, innerHeight);
}

export function setup() {
    createCanvas(innerWidth, innerHeight);

    for (let i = 0; i < 99; i++) {
        people.push(new Person(false));
    }
    people.push(new Person(true));
}

function update() {
    for (let person of people) {
        person.update(people);
    }
    for (let person of people) {
        person.move();
    }
}

export function draw() {
    update();
    clear();

    for (let person of people) {
        person.draw();
    }
}
