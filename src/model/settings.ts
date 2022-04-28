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
    private static instance: Settings;
    private constructor() {
    }
    public static getInstance() {
        if (this.instance == null) {
            Settings.instance = new this();
        }
        return Settings.instance;
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
        console.log("hello")
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
}