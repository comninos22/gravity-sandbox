export class Settings {
    mass: number = 0;
    density: number = 0;
    scale: number = 0;
    transformX: number = 0;
    transformY: number = 0
    cosmicConstant: number = 0.09;
    canvasWidth: number = 0;
    canvasHeight: number = 0;
    hasCollisions: boolean = true;
    leavesTracing: boolean = false;
    heatConversionPercentage: number = .5;
    private speed: number = 10;
    subscribers: Array<Subscriber> = [];
    private static instance: Settings;
    private constructor() {
    }
    public static getInstance() {
        if (this.instance == null) {
            Settings.instance = new this();
        }
        return Settings.instance;
    }
    setSpeed(sp: number) {
        if (sp >= 0 && sp <= 1000) this.speed = sp 
        else throw new Error("Invalid speed value")
        this.notify("speed");
    }
    setImpactHeatConversion(percentage: number) {
        this.heatConversionPercentage = percentage;
    }
    setDensity(density: number) {
        this.density = density
    }
    setScale(scale: number) {
        this.scale = scale;
    }
    setMass(mass: number) {
        this.mass = mass
    }
    setTracing(tracing: boolean) {
        this.leavesTracing = tracing;
    }
    setCollision(collisions: boolean) {
        this.hasCollisions = collisions
    }
    setCosmicConstant(cosmicConstant: number) {
        this.cosmicConstant = cosmicConstant;
    }
    clearTransform = () => {
        this.transformY = (this.canvasHeight * this.scale)
        this.transformX = (this.canvasWidth * this.scale)
    }
    setTransformY(y: number) {
        this.transformY += y;
    }
    setTransformX(x: number) {
        this.transformX += x;
    }
    getTransform() {
        return [this.transformX, this.transformY]
    }
    toggleTracing = () => {
        if (this.leavesTracing) {
            this.setTracing(false);
        } else {
            this.setTracing(true);
        }
    }
    toggleCollisions = () => {
        if (this.hasCollisions) {
            this.setCollision(false);
        } else {
            this.setCollision(true);
        }
    }
    getSpeed=()=>{
        return this.speed
    }
    subscribe(subscriber: Subscriber) {
        this.subscribers.push(subscriber);
    }
    notify(prop: string) {
        for (let sub of this.subscribers) {
            sub.key == prop && sub.callback((this as any)[prop]);
        }
    }
}

export class Subscriber {
    subscriber: any;
    key: string;
    callback: Function;
    constructor(sub: any, key: string, cb: Function) {
        this.subscriber = sub
        this.key = key;
        this.callback = cb
    }
}