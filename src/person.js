import Vector from "./vector";
import Point from "./point";
import {randInt, randUniform} from "./utils";
import {TRANSMISSION_RATE} from "./config";

export default class Person {
    constructor(infected, maxSpawnVel, id) {
        this.pos = new Point(randInt(0, innerWidth), randInt(0, innerHeight));
        this.vel = new Vector(randUniform(-maxSpawnVel, maxSpawnVel), randUniform(-maxSpawnVel, maxSpawnVel));
        this.id = id;
        this.infected = infected;
        this.wasInfected = false;
    }

    update(people, deathRate, recoveryTime, borderWindThreshold, leftWind, rightWind, topWind, bottomWind,
           separationThreshold, separationStrength, /*transmissionRate,*/ alignmentThreshold, alignmentStrength,
           cohesionThreshold, cohesionStrength, speedLimit) {
        // Death
        if (this.infected && Math.random() < deathRate) {
            return true;
        }

        // Recovery
        if (this.infected) {
            if (new Date() - this.infected >= recoveryTime) {
                this.infected = null;
                this.wasInfected = true;
            }
        }

        // Avoid edges
        if (this.pos.x <= borderWindThreshold) {
            this.vel.add(leftWind);
        }
        if (this.pos.x >= innerWidth - borderWindThreshold) {
            this.vel.add(rightWind);
        }
        if (this.pos.y <= borderWindThreshold) {
            this.vel.add(topWind);
        }
        if (this.pos.y >= innerHeight - borderWindThreshold) {
            this.vel.add(bottomWind);
        }

        // Separation
        for (let person of people) {
            let personToSelf = person.pos.vectorTo(this.pos);
            let originalLength = personToSelf.len();
            if (originalLength <= separationThreshold) {
                if (person.infected && !this.infected && !this.wasInfected && TRANSMISSION_RATE(originalLength)) {
                    this.infected = new Date();
                }
                personToSelf.normalize();
                personToSelf.divide(originalLength);
                personToSelf.multiply(separationStrength);
                this.vel.add(personToSelf);
            }
        }

        // Alignment
        let averageVel = new Vector(0, 0);
        let alignmentCounter = 0;
        for (let person of people) {
            if (person.pos.vectorTo(this.pos).len() <= alignmentThreshold) {
                averageVel.add(person.vel);
                alignmentCounter += 1;
            }
        }
        averageVel.divide(alignmentCounter);
        averageVel.multiply(alignmentStrength);
        this.vel.add(averageVel);

        // Cohesion
        let averageX = this.pos.x;
        let averageY = this.pos.y;
        let cohesionCounter = 1;
        for (let person of people) {
            if (person.pos.vectorTo(this.pos).len() <= cohesionThreshold) {
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
        cohesionVector.multiply(cohesionStrength);
        this.vel.add(cohesionVector);

        // Speed Limit
        if (this.vel.len() > speedLimit) {
            this.vel.normalize(speedLimit);
        }

        return false;
    }

    move() {
        this.pos.move(this.vel);
    }

    draw(p) {
        if (this.infected !== null) {
            p.fill(255, 0, 0);
        } else {
            if (this.wasInfected) {
                p.fill(203, 30, 218);
            } else {
                p.fill(170, 198, 202);
            }
        }
        // if (this.id === 0) {
        //     console.log(typeof this.pos.x);
        //     console.log(this.pos.x);
        // }
        p.circle(this.pos.x, this.pos.y, 15);
    }
}
