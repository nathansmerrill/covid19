export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    len() {
        return Math.sqrt(
            Math.pow(this.x, 2) +
            Math.pow(this.y, 2)
        );
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    multiply(value) {
        self.x *= value;
        self.y *= value;
    }

    divide(value) {
        if (value !== 0) {
            this.x /= value;
            this.y /= value;
        }
    }

    normalize(value=1) {
        this.divide(this.len());
        this.multiply(value);
    }
}