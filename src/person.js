import Vector from "./vector";
import Point from "./point";
import {randInt, randUniform} from "./utils";
import {
    MAX_SPAWN_VEL,
    BORDER_WIND_MARGIN,
    BORDER_WIND_STRENGTH,
    SEPARATION_THRESHOLD,
    SEPARATION_STRENGTH,
    ALIGNMENT_THRESHOLD,
    ALIGNMENT_STRENGTH,
    COHESION_THRESHOLD,
    COHESION_STRENGTH,
    SPEED_LIMIT,
    TRANSMISSION_RATE,
    DEATH_RATE,
    RECOVERY_TIME
} from "./config";

const leftWind = new Vector(BORDER_WIND_STRENGTH, 0);
const rightWind = new Vector(-BORDER_WIND_STRENGTH, 0);
const topWind = new Vector(0, BORDER_WIND_STRENGTH);
const bottomWind = new Vector(0, -BORDER_WIND_STRENGTH);

export default class Person {
    constructor(infected, id) {
        this.id = id;
        this.pos = new Point(randInt(0, innerWidth), randInt(0, innerHeight));
        this.vel = new Vector(randUniform(-MAX_SPAWN_VEL, MAX_SPAWN_VEL), randUniform(-MAX_SPAWN_VEL, MAX_SPAWN_VEL));
        this.infected = infected;
        this.wasInfected = false;
    }

    update(people) {
        // Death
        if (this.infected && Math.random() < DEATH_RATE) {
            return true;
        }

        // Recovery
        if (this.infected) {
            if (new Date() - this.infected >= RECOVERY_TIME) {
                console.log('i recovered');
                this.infected = null;
                this.wasInfected = true;
            }
        }

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

        // Separation
        for (let person of people) {
            let personToSelf = person.pos.vectorTo(this.pos);
            let originalLength = personToSelf.len();
            if (originalLength <= SEPARATION_THRESHOLD) {
                if (person.infected && !this.infected && !this.wasInfected && TRANSMISSION_RATE(originalLength)) {
                    this.infected = new Date();
                }
                personToSelf.normalize();
                personToSelf.divide(originalLength);
                personToSelf.multiply(SEPARATION_STRENGTH);
                this.vel.add(personToSelf);
            }
        }

        // Alignment
        let averageVel = new Vector(0, 0);
        let alignmentCounter = 0;
        for (let person of people) {
            if (person.pos.vectorTo(this.pos).len() <= ALIGNMENT_THRESHOLD) {
                averageVel.add(person.vel);
                alignmentCounter += 1;
            }
        }
        averageVel.divide(alignmentCounter);
        averageVel.multiply(ALIGNMENT_STRENGTH);
        this.vel.add(averageVel);

        // Cohesion
        let averageX = this.pos.x;
        let averageY = this.pos.y;
        let cohesionCounter = 1;
        for (let person of people) {
            if (person.pos.vectorTo(this.pos).len() <= COHESION_THRESHOLD) {
                averageX += person.pos.x;
                averageY += person.pos.y;
                cohesionCounter++;
            }
        }
        if (cohesionCounter !== 0) {
            averageX /= cohesionCounter;
            averageY /= cohesionCounter;
        }
        let cohesionVector = this.pos.vectorTo(new Point(averageX, averageY));
        cohesionVector.multiply(COHESION_STRENGTH);
        this.vel.add(cohesionVector);

        // Speed Limit
        if (this.vel.len() > SPEED_LIMIT) {
            this.vel.normalize(SPEED_LIMIT);
        }

        return false;
    }

    move() {
        this.pos.move(this.vel);
    }

    draw() {
        if (this.infected !== null) {
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
