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

    fill(0, 0, 0);
    for (let person of dead) {
        circle(person.x, person.y, 15);
    }
    for (let person of people) {
        person.draw();
    }
}
