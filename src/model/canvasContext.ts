



import { RealObject } from "./object";
import { Settings } from "./settings";
import { Simulator } from "./simulator";
import { ToolManager } from "./tools";
import { Utils } from "./utils";

export class Canvas {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | undefined | null;
    private simulator: Simulator;
    width: number;
    height: number;
    particles: any = {};
    private paused: boolean;
    settings: Settings;
    pausedByUser: boolean;
    toolHandler: ToolManager;
    renderCallbacks: RenderCallback = {};
    constructor(canvas: HTMLCanvasElement | null,) {
        this.settings = Settings.getInstance();
        this.toolHandler = new ToolManager();
        this.simulator = new Simulator();
        this.canvas = canvas;
        this.ctx = this.canvas?.getContext("2d");
        let boundingRect: DOMRect | undefined = this.canvas?.getBoundingClientRect();
        this.width = boundingRect?.width ?? 0;
        this.height = boundingRect?.height ?? 0;
        this.ctx!.strokeStyle = "white";
        this.paused = false;
        this.pausedByUser = false;

    }
    getToolHandler = () => {
        return this.toolHandler;
    }

    start = () => {
        this.update();
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
        this.getParticles().forEach(p => this.drawParticle(p, scale));
        for (let prop in this.renderCallbacks) this.renderCallbacks[prop]()
    }

    renderLine = (speedLine: any) => {
        this.ctx?.beginPath();
        this.ctx?.moveTo(speedLine.x1, speedLine.y1);
        this.ctx?.lineTo(speedLine.x2, speedLine.y2);
        this.ctx?.stroke()
    }

    drawParticle = (p: RealObject, scale: number) => {
        this.ctx?.beginPath();
        this.ctx!.fillStyle = p.getColor();
        this.ctx?.arc(...p.getDisplayPos(), p.getDisplayRadius(), 0, 2 * 3.14);
        this.ctx?.stroke();
        this.ctx?.fill();
    }

    clear = () => {
        this.ctx?.clearRect(0, 0, this.width, this.height)
    }

    determineOutOfBounds = (v: RealObject) =>
        v.x > -10000000 / v.settings.scale
        && v.x < (this.width + 10000000) / v.settings.scale
        && v.y < (this.height + 10000000) / v.settings.scale
        && v.y > -10000000 / v.settings.scale

    // filterParticles = (predicate: any) => this.setParticles(this.getParticles().filter(predicate))

    update = () => {
        if (!this.paused) {
            this.simulator.doCalculations2()
        }
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
}




interface RenderCallback {
    [key: string]: Function
}