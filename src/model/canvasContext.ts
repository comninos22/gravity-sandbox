



import { EventHandler } from "./eventHandler";
import { RealObject } from "./object";
import { Settings, Subscriber } from "./settings";
import { Simulator } from "./simulator";
import { ToolManager } from "./tools";
import { Utils } from "./utils";

export class Canvas {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | undefined | null;
    private simulator: Simulator;
    private width: number;
    private height: number;
    private particles: any = {};
    private paused: boolean;
    private settings: Settings;
    private pausedByUser: boolean;
    private toolHandler: ToolManager;
    private renderCallbacks: RenderCallback = {};
    private eventHandler: EventHandler
    private calcCB: number = 0;
    private stack: [string][] = [];
    constructor(canvas: HTMLCanvasElement | null,) {
        this.settings = Settings.getInstance();
        this.toolHandler = new ToolManager(this);
        this.simulator = new Simulator();
        this.canvas = canvas;
        this.ctx = this.canvas?.getContext("2d");
        this.ctx!.fillStyle = "white"
        this.ctx!.strokeStyle = "white"
        let boundingRect: DOMRect = this.canvas!.getBoundingClientRect();
        this.width = boundingRect?.width ?? 0;
        this.height = boundingRect?.height ?? 0;

        this.paused = false;
        this.pausedByUser = false;
        this.eventHandler = new EventHandler(this);
    }
    isPausedByUser() {
        return this.pausedByUser
    }
    getToolHandler = () => {
        return this.toolHandler;
    }
    clearRenderCallbacks = () => {
        this.renderCallbacks = {};
    }
    start = () => {

        this.update();
        this.settings.subscribe(new Subscriber(this, "speed", this.refreshSimulation))
        this.refreshSimulation();
    }
    refreshSimulation = (speed: number = this.settings.getSpeed()) => {
        if (this.calcCB) clearInterval(this.calcCB)
        this.calcCB = setInterval(() => {
            if (!this.paused) {
                this.simulator.simulate()
            }
        }, speed)
    }
    continue = (isUser = false) => {
        if (!this.pausedByUser || isUser) {
            this.paused = false;
            return true;
        }
    }

    pause = () => {
        this.paused = true;
        return true;
    }

    togglePause = (isUser = false) => {
        if (this.paused) {
            if (isUser) {
                this.pausedByUser = true;
            }
            this.continue(isUser);
        } else {
            if (isUser) {
                this.pausedByUser = true;
            }
            this.pause();
        }
    }

    render = () => {
        let scale = this.settings.scale;

        //Change internal state and draw every particle,
        //this.getParticles().forEach(p => this.drawParticle(p, scale));
        for (let particle of this.getParticles()) this.drawParticle(particle)
        for (let prop in this.renderCallbacks) this.renderCallbacks[prop]()
    }
    highlightParticle = (p: RealObject) => {
        try {
            this.ctx?.beginPath();
            this.ctx!.strokeStyle = "red"
            this.ctx?.arc(...p.getDisplayPos(), p.getDisplayRadius() * 10, 0, 2 * 3.14);
            this.ctx?.stroke()
            this.ctx?.closePath()
        } catch (e) {

        }
    }
    renderLine = (speedLine: any) => {
        this.ctx?.beginPath();
        this.ctx!.strokeStyle = "white"

        this.ctx?.moveTo(speedLine.x1, speedLine.y1);
        this.ctx?.lineTo(speedLine.x2, speedLine.y2);
        this.ctx?.stroke()
        this.ctx?.closePath()

    }

    drawParticle = (p: RealObject) => {
        this.ctx?.beginPath();
        this.ctx?.arc(...p.getDisplayPos(), p.getDisplayRadius(), 0, 2 * 3.14);
        this.ctx?.fill();
        this.ctx?.closePath()

    }

    clear = () => {
        let scale = this.settings.scale
        this.ctx?.clearRect(0, 0, this.width / scale, this.height / scale)
    }

    determineOutOfBounds = (v: RealObject) =>
        v.x > -10000000 / v.settings.scale
        && v.x < (this.width + 10000000) / v.settings.scale
        && v.y < (this.height + 10000000) / v.settings.scale
        && v.y > -10000000 / v.settings.scale

    // filterParticles = (predicate: any) => this.setParticles(this.getParticles().filter(predicate))

    update = () => {
        if (!this.settings.leavesTracing) {
            this.clear()
        }
        this.render();
        requestAnimationFrame(this.update.bind(this))
    }

    setParticles(p: Array<RealObject>) {
        this.simulator.setParticles(p)
    }

    getParticles = () => {
        return this.simulator.getParticles();
    }

    clearParticles = () => {
        this.simulator.filterParticles((v: any) => 0)
    }

    generateParticles(num: number) {
        let rect = this.canvas!.getBoundingClientRect()
        if (num > 10000) throw new Error("You gonna blow the pc man")
        let settings = this.settings
        let particles = []
        for (let i: number = 0; i < num; i++) {
            let object: RealObject = RealObject.generateSelf(
                Utils.random(0, rect.width / settings.scale),
                Utils.random(0, rect.height / settings.scale),
                Utils.random(-15, 15),
                Utils.random(-15, 15),
                Utils.random(settings.mass, settings.mass),
                settings.density
            );
            particles.push(object)
        }
        this.setParticles(particles)
    }
    getRenderCallbacks() {
        return this.renderCallbacks
    }
    save() {
        let state = {} as any
        for (let property in this.ctx) {
            if (property == 'canvas' || typeof this.ctx[property] == 'function') continue
            state[property] = this.ctx[property]
        }
        this.stack.push(state)
    }

    restore() {
        let state = this.stack.pop() || {}
        for (let property in state) this.ctx![property] = state[property]
    }
}




interface RenderCallback {
    [key: string]: Function
}