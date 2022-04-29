export class Utils {
    static random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    //Object of Objects
    static objectToArray(object: any) {
        console.log(object)
        return Object.keys(object).map(key => object[key])
    }
    static getDistance(x1: number, y1: number, x2: number, y2: number) {
        return Utils.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    static sin(theta: number) {
        let approximation = 0;
        let flipper = true;
        let currentApproximation = 0
        let i = 1;
        do {
            flipper = !flipper
            let sign = flipper ? -1 : 1
            currentApproximation = sign * Math.pow(theta, i) / this.f(i)
            approximation += currentApproximation
            i += 2;
        } while (currentApproximation > 5e-2)
        return approximation
    }
    static cos(theta: number, precision: number = 4) {
        let approximation = 0;
        let flipper = true;
        let currentApproximation = 0
        let i = 0;
        do {
            flipper = !flipper
            let sign = flipper ? -1 : 1
            currentApproximation = sign * Math.pow(theta, i) / this.f(i)
            approximation += currentApproximation
            i += 2;
        } while (currentApproximation > 5e-2)
        return approximation
    }
    static sqrt(num: number) {
        var lastGuess, guess = num / 3;
        let abs = Math.abs
        do {
            lastGuess = guess;  // store the previous guess
            guess = (num / guess + guess) / 2;
        } while (abs(lastGuess - guess) > 5e-2);
        return guess;
    };
    static f(n: number): number {
        if (n == 0) return 1;
        return Utils.f(n - 1) * n
    }
    //ultra fast sign
    static sign(x: number) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    }
}