import Vector from "./vector";
import Point from "./point";
import {randInt, randUniform} from "./utils";
import {MAX_SPAWN_VEL} from "./config";

export default class Person {
    constructor(infected) {
        this.pos = new Point(randInt(0, innerWidth), randInt(0, innerHeight));
        this.vel = new Vector(randUniform(-MAX_SPAWN_VEL, MAX_SPAWN_VEL), randUniform(-MAX_SPAWN_VEL, MAX_SPAWN_VEL));
        this.infected = infected;
        this.wasInfected = false;
    }

    update(boids) {
        this.pos.move(this.vel);
    }

    draw() {
        if (this.infected) {
            fill(255, 0, 0);
        } else {
            if (this.wasInfected) {
                fill(203, 30, 218);
            } else {
                fill(170, 198, 202);
            }
        }
        circle(this.pos.x, this.pos.y, 15);
    }
}
