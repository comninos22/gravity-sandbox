import { RealObject } from "./object"
import { Settings } from "./settings";
import { Utils } from "./utils";
import { UV } from "./vector";
export class Simulator {
    private particles: Array<RealObject> = []
    private settings: Settings = Settings.getInstance();
    private destroyedParticles: Dictionary = {}
    private particleLength: number = 0;
    private atLeastOneDestroyed = false
    simulate() {
        this.destroyedParticles = {}
        let G = this.settings.cosmicConstant
        let length = this.particleLength;
        this.atLeastOneDestroyed = false
        for (let i = 0; i < this.particleLength; i++) {
            let p1 = this.particles[i]
            let [x1, y1] = p1.getPos();
            let r1 = p1.getRadius()
            let m1 = p1.getMass()
            for (let j = 0; j < this.particleLength; j++) {
                let p2 = this.particles[j]
                if (p1 != p2) {
                    //Distance between 2 points
                    //let distance: number = this.getDistance(p1, p2);
                    let [x2, y2] = p2.getPos()
                    let distanceSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;
                    if (distanceSquared > (r1 + p2.getRadius()) ** 2) {
                        let force: number = G * ((m1 * p2.getMass()) / distanceSquared);
                        let newForce = UV.addVectors(x1, y1, ...p2.getPos()).multiply(force);
                        p1.applyForce(newForce.multiply(1 / 2));
                        p2.applyForce(newForce.multiply(-1 / 2));
                    }
                    else if (this.settings.hasCollisions && this.notDestroyed(p1, p2)) this.inelasticCollision(p1, p2);
                }
            }
        }
        this.atLeastOneDestroyed && this.filterParticles((v: RealObject) => !(v.id in this.destroyedParticles));
        for (let particle of this.particles) particle.tick()
    }

    notDestroyed(p1: RealObject, p2: RealObject) {
        return !(this.destroyedParticles[p1.id]!) && !(this.destroyedParticles[p2.id]!);
    }
    setParticles(p: Array<RealObject>) {
        this.particles = p;
        this.particleLength = this.particles.length

    }
    getParticles() {
        return this.particles;
    }

    filterParticles = (predicate: any) => this.setParticles(this.getParticles().filter(predicate))

    inelasticCollision(p1: RealObject, p2: RealObject) {
        let [bigger, smaller]: Array<RealObject> = [p1, p2].sort((a, b) => b.getMass() - a.getMass());
        let newMass = bigger.getMass() + smaller.getMass();
        let afterImpactMagnitude = Math.sqrt((bigger.getKineticEnergy() + smaller.getKineticEnergy()) / newMass)
        afterImpactMagnitude *= this.settings.heatConversionPercentage
        let newSpeed = UV.addVectors(
            ...bigger.getMomentum().getCoefficients(),
            ...smaller.getMomentum().getCoefficients()
        ).multiply(afterImpactMagnitude)
        bigger.setMass(newMass);
        bigger.applySpeedDelta(newSpeed);
        this.setDestroyed(smaller)
        return [bigger, smaller];
    }
    setDestroyed(p1: RealObject) {
        this.destroyedParticles[p1.id] = p1;
        this.atLeastOneDestroyed = true;
    }

}

interface Dictionary {
    [key: string]: RealObject | null
}