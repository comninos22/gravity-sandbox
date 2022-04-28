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
}
//     increaseByVector(v: UV) {
//         this.x += v.x
//         this.y += v.y
//     }
// }