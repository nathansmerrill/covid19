import Vector from "./vector";
import {randint} from "./utils";

export default class Person {
    constructor() {
        this.x = randint(innerWidth);
        this.y = randint(innerHeight);
        this.vel = new Vector(1, 1);
    }

    update() {
        this.x += this.vel.x;
        this.y += this.vel.y;
    }

    draw() {
        fill(51);
        circle(this.x, this.y, 20);
    }
}