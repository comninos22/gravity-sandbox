import { Utils } from "./utils";

export class UV {
    public x: number = 0;
    public y: number = 0;
    constructor(x: number, y: number) {
        this.x = isNaN(x) ? 0 : x;
        this.y = isNaN(y) ? 0 : y;
    }
    clone() {
        return new UV(this.x, this.y)
    }
    getCoefficients(): [number, number] {
        return [this.x, this.y];
    }
    getMagnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }
    multiply(x: number, y: number | null = null) {
        this.x *= x;
        this.y *= y ?? x;
        return this;
    }
    increaseWith(v: UV) {
        this.x += v.x
        this.y += v.y
        return this;
    }
    increaseBy(x: number, y: number | null = null) {
        this.x += x;
        this.y += y ?? x;
        return this;
    }
    reset() {
        this.x = 0;
        this.y = 0;
    }
    static getSlope(x1: number, y1: number, x2: number, y2: number) {
        return (y2 - y1) / (x2 - x1);
    }
    private static tanToRads(theta: number) {
        return Math.atan(theta)
    }
    static addVectors(x1: number, y1: number, x2: number, y2: number): UV {
        let slope = this.getSlope(x1, y1, x2, y2);
        let rads = this.tanToRads(slope);
        let newX: number = Math.sign(x2 - x1) * Math.cos(rads);
        let newY: number = Math.sign(y2 - y1) * Math.sin(rads);
        if (rads > 0)
            return new UV(newX, newY);
        return new UV(newX, -newY);
    }
}
//     increaseByVector(v: UV) {
//         this.x += v.x
//         this.y += v.y
//     }
// }