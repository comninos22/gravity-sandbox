import { RealObject } from "./object"
import { Settings } from "./settings";
import { Utils } from "./utils";
import { UV } from "./vector";
export class Simulator {
    private particles: Array<RealObject> = []
    private settings: Settings = Settings.getInstance();
    private combinations: Array<[RealObject, RealObject]> = [];
    // doCalculations() {
    //     for (let combination of this.combinations) {
    //         let [p1, p2] = combination;
    //         //Distance between 2 points
    //         let distance: number = this.getDistance(p1, p2);
    //         if (distance > p1.getRadius() + p2.getRadius()) {
    //             //Newtons law of gravity
    //             let force: number = this.settings.cosmicConstant * ((p1.getMass() * p2.getMass()) / (distance ** 2));
    //             let [x1, y1]: Array<number> = p1.getPos();
    //             let [x2, y2]: Array<number> = p2.getPos();
    //             let slope: number;
    //             let rads: number;
    //             //Slope of the line, in other words tan(φ)
    //             slope = (y2 - y1) / (x2 - x1);
    //             //Tan to rads
    //             rads = Math.atan(slope);
    //             //sign is directional vector correction, with coefficient analysis

    //             let forceX: number = Math.sign(x2 - x1) * Math.cos(rads) * force;
    //             let forceY: number = Math.sign(y2 - y1) * Math.sin(rads) * force;


    //             //if angle < 0 multiply  forceY with the sin supplement
    //             if (rads > 0) {
    //                 p1.applyForce(forceX, forceY)
    //             } else {
    //                 p1.applyForce(forceX, -forceY)
    //             }
    //         }
    //         else if (this.settings.hasCollisions) {
    //             let [bigger, smaller]: Array<RealObject> = [p1, p2].sort((a, b) => b.getMass() - a.getMass());
    //             bigger.setMass((+bigger.getMass()) + (+smaller.getMass()));
    //             this.filterParticles((v: RealObject) => v.id != smaller.id);
    //         }
    //     }
    //     for (let particle of this.getParticles()) {
    //         particle.tick();
    //     }
    // }
    doCalculations2() {
        let destroyed: Dictionary = {};
        let checked: Dictionary = {};
        for (let p1 of this.particles) {
            for (let p2 of this.particles) {
                if (p1 != p2) {
                    //Distance between 2 points
                    let distance: number = this.getDistance(p1, p2);
                    if (distance > p1.getRadius() + p2.getRadius()) {
                        let force: number = this.settings.cosmicConstant * ((p1.getMass() * p2.getMass()) / (distance ** 2));
                        if (force < 1) continue;
                        let newForce = this.addVectors(...p1.getPos(), ...p2.getPos()).multiply(force);
                        p1.applyForce(newForce.multiply(1 / 2));
                        p2.applyForce(newForce.multiply(-1 / 2));
                    }
                    else if (this.settings.hasCollisions && !(destroyed[p1.id]!) && !(destroyed[p2.id])) {
                        let [bigger, smaller]: Array<RealObject> = [p1, p2].sort((a, b) => b.getMass() - a.getMass());
                        let newMass = bigger.getMass() + smaller.getMass();
                        let afterImpactMagnitude = Math.sqrt((bigger.getKineticEnergy() + smaller.getKineticEnergy()) / newMass)
                        afterImpactMagnitude *= this.settings.heatConversionPercentage
                        let newSpeed = this.addVectors(
                            ...bigger.getSpeed().getCoefficients(),
                            ...smaller.getSpeed().getCoefficients()
                        ).multiply(afterImpactMagnitude)
                        bigger.setMass(newMass);
                        bigger.applySpeedDelta(newSpeed);
                        destroyed[smaller.id] = smaller;
                    }
                }
            }
        }
        this.filterParticles((v: RealObject) => !(v.id in destroyed));
        this.getParticles().forEach(v => v.tick())
    }
    setParticles(p: Array<RealObject>) {
        this.particles = p;
    }
    getParticles() {
        return this.particles;
    }
    getDistance(p1: RealObject, p2: RealObject) {
        let [x1, y1] = p1.getPos();
        let [x2, y2] = p2.getPos()
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    filterParticles = (predicate: any) => this.setParticles(this.getParticles().filter(predicate))
    preservationOfAngularMomentum(bigger: RealObject, smaller: RealObject): RealObject {
        let newVelocity = 1;
        let newMass = (+bigger.getMass()) + (+smaller.getMass());
        return bigger;
    }

    getSlope(x1: number, y1: number, x2: number, y2: number) {
        return (y2 - y1) / (x2 - x1);
    }
    tanToRads(theta: number) {
        return Math.atan(theta)
    }
    addVectors(x1: number, y1: number, x2: number, y2: number): UV {
        let slope = this.getSlope(x1, y1, x2, y2);
        let rads = this.tanToRads(slope);
        let newX: number = Math.sign(x2 - x1) * Math.cos(rads);
        let newY: number = Math.sign(y2 - y1) * Math.sin(rads);
        if (rads > 0)
            return new UV(newX, newY);
        return new UV(newX, -newY);
    }
}

interface Dictionary {
    [key: string]: RealObject | null
}