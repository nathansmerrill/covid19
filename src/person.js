import Vector from "./vector";
import Point from "./point";
import {randInt, randUniform} from "./utils";
import {BORDER_WIND_MARGIN, BORDER_WIND_STRENGTH, MAX_SPAWN_VEL, SPEED_LIMIT} from "./config";

const leftWind = new Vector(BORDER_WIND_STRENGTH, 0);
const rightWind = new Vector(-BORDER_WIND_STRENGTH, 0);
const topWind = new Vector(0, BORDER_WIND_STRENGTH);
const bottomWind = new Vector(0, -BORDER_WIND_STRENGTH);

export default class Person {
    constructor(infected) {
        this.pos = new Point(randInt(0, innerWidth), randInt(0, innerHeight));
        this.vel = new Vector(randUniform(-MAX_SPAWN_VEL, MAX_SPAWN_VEL), randUniform(-MAX_SPAWN_VEL, MAX_SPAWN_VEL));
        this.infected = infected;
        this.wasInfected = false;
    }

    update(people) {
        // Avoid edges
        if (this.pos.x <= BORDER_WIND_MARGIN) {
            this.vel.add(leftWind);
        }
        if (this.pos.x >= innerWidth - BORDER_WIND_MARGIN) {
            this.vel.add(rightWind);
        }
        if (this.pos.y <= BORDER_WIND_MARGIN) {
            this.vel.add(topWind);
        }
        if (this.pos.y >= innerHeight - BORDER_WIND_MARGIN) {
            this.vel.add(bottomWind);
        }

        // Speed Limit
        if (this.vel.len() > SPEED_LIMIT) {
            this.vel.normalize(SPEED_LIMIT);
        }
    }

    move() {
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
