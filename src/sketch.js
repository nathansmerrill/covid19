import Person from "./person";

let people = [];

export function setup() {
    createCanvas(innerWidth, innerHeight);
    for (let i = 0; i < 10; i++) {
        people.push(new Person());
    }
}

function update() {
    for (let person of people) {
        person.update();
    }
}

export function draw() {
    update();
    clear();

    for (let person of people) {
        person.draw();
    }
}
