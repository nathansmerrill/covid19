import Vector from "./vector";

export default class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    vectorTo(point) {
        return new Vector(point.x - this.x, point.y - this.y);
    }
}
