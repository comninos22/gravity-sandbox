import { Utils } from "./utils";
import { Settings } from "./settings";
import { UV } from "./vector";
export class RealObject {
    private speed: UV;
    private acceleration: UV;
    private pos: UV;
    private mass: number = 0;
    public momentum: UV = new UV(0, 0);
    x: number;
    y: number;
    public id: number;
    public density: number = 1;
    public volume: number = 1;
    public settings: Settings;
    public radius: number = 1;
    public color: string;
    constructor(x: number, y: number, spx: number, spy: number, mass: number, density: number) {
        this.settings = Settings.getInstance();
        this.id = Utils.random(0, 1000000);
        this.speed = new UV(spx, spy);
        this.acceleration = new UV(0, 0)
        this.pos = new UV(x, y);
        this.x = x;
        this.y = y;
        this.density = density
        this.setMass(mass);
        this.color = `hsl(${0},100%,100%)`
    }
    getDisplayPos(): [number, number] {
        let [x, y] = this.pos.getCoefficients()
        return [
            (x + this.radius + this.settings.transformX) * this.settings.scale,
            (y + this.radius + this.settings.transformY) * this.settings.scale
        ]
    }
    public applySpeedDelta(delta: UV) {
        this.speed.increaseWith(delta);
    }
    public getSpeed() {
        return this.speed;
    }
    public applyForce(accUV: UV) {
        this.acceleration.increaseWith(accUV.multiply(1 / this.mass))
    }
    getDisplayRadius() {
        return this.radius * this.settings.scale//< .01 ? 0 : this.radius * this.settings.scale;
    }
    private updateSpeed() {
        this.speed.increaseWith(this.acceleration)
    }
    public getColor() {
        return this.color;
    }
    private move() {
        this.pos.increaseWith(this.speed)
    }

    public tick() {
        this.updateSpeed();
        this.move();
        this.acceleration.reset();
        //this.updateMomentum();

    }
    public getPos(): [number, number] {
        let [x, y] = this.pos.getCoefficients()
        return [x + this.radius, y + this.radius]
    }
    public getMass(): number {
        return this.mass;
    }

    public setMass(mass: number) {
        this.mass = mass;
        this.volume = this.mass * this.density;
        this.radius = Math.pow(this.volume / ((4 / 3) * 3.14), 1 / 3);
    }

    public getRadius() {
        return this.radius;
    }
    public setDensity(density: number) {
        this.density = density;
    }
    public getDensity() {
        return this.density;
    }
    public getVolume() {
        return this.volume;
    }
    static generateSelf(x: number, y: number, spx: number, spy: number, mass: number, density: number) {
        return new RealObject(x, y, spx, spy, mass, density)
    }

    getMomentum() {
        let momentum = this.speed.clone().multiply(1 / this.mass)
        return momentum
    }
    getKineticEnergy() {
        return .5 * this.mass * this.speed.getMagnitude() ** 2;
    }
}