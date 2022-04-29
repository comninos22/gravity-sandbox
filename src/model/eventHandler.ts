import { Canvas } from "./canvasContext";
import { Settings } from "./settings";
import { ToolManager } from "./tools";
import { Utils } from "./utils";
export class EventHandler {
    public canvas: Canvas;
    private allEvents = "click mousedown mouseup focus blur keydown change dblclick mousemove mouseover mouseout mousewheel keydown keyup keypress textInput touchstart touchmove touchend touchcancel resize scroll zoom select change submit reset";
    private eventNames: Array<string>
    private clickDown = false;
    private clickMoving = false;
    public prevClientX = 0;
    public prevClientY = 0;
    public currentEvent: Event | null = null;
    private settings: Settings;
    constructor(canvas: Canvas) {
        this.settings = Settings.getInstance()
        this.eventNames = this.allEvents.split(" ")
        this.canvas = canvas;
        this.attachEvents();
    }
    attachEvents() {
        window.onresize = () => {
            let rect = document.body.getBoundingClientRect();
            let canvas = document.querySelector("canvas");
            let width = (rect.width)
            this.canvas!.save();
            canvas!.setAttribute("width", rect.width.toString())
            canvas!.setAttribute("height", rect.height.toString())
            this.canvas!.restore();
        }
        window.dispatchEvent(new Event("resize"))
        for (let eventType of this.eventNames) {
            document.querySelector("canvas")?.addEventListener(eventType, this.switchEventType)
        }
        document.querySelector("body")?.addEventListener("keydown", this.switchEventType)
        document.querySelector("body")?.addEventListener("wheel", this.switchEventType)
        document.querySelector("input.mass")!.addEventListener("change", (event) => {
            Settings.getInstance().setMass(Math.pow(10, +(event.target as HTMLInputElement).value))
        })
        document.querySelector("input.density")!.addEventListener("change", (event) => {
            Settings.getInstance().setDensity(+(event.target as HTMLInputElement).value)
        })
        document.querySelector("input.speed")!.addEventListener("change", (event) => {
            Settings.getInstance().setSpeed(Math.pow(10, +(event.target as HTMLInputElement).value))

        })

        document.querySelector(".collisions")!.addEventListener("click", (event) => {
            if (this.settings.hasCollisions) {
                this.settings.setCollision(false);
            } else {
                this.settings.setCollision(true);
            }
        })
        document.querySelector(".leaveTraces")!.addEventListener("click", (event) => {
            if (this.settings.leavesTracing) {
                this.settings.setTracing(false);
            } else {
                this.settings.setTracing(true);
            }
        })
        document.querySelector("input.pause")!.addEventListener("click", (event) => {
            this.canvas.togglePause(true);
        })

    }

    getCanvas() {
        return this.canvas;
    }
    getCurrentEvent() {
        return this.currentEvent;
    }
    isDragging() {
        return this.clickDown && this.clickMoving
    }
    switchEventType = (e: Event) => {
        this.currentEvent = e;
        switch (e.type.toLowerCase()) {
            case "mousedown":
                this.onMouseDown(e as MouseEvent);
                break;
            case "mouseup":
                this.onMouseUp(e as MouseEvent);
                break;
            case "mousemove":
                this.onDrag(e as MouseEvent);
                break;
            case "click":
                this.onClick(e as MouseEvent);
                break;
            case "wheel":
                this.onWheelMove(e as WheelEvent);
                break;
            case "keypress":
                this.onKeyDown(e as KeyboardEvent);
        }
        this.canvas.getToolHandler().execute(this);
    }
    onDrag(event: MouseEvent) {
        if (this.clickDown) {
            this.clickMoving = true;
        }
    }
    onMouseDown(event: MouseEvent) {
        this.clickDown = true;
        this.prevClientX = event.clientX;
        this.prevClientY = event.clientY;
    }
    onMouseUp(event: MouseEvent) {

        this.clickDown = false;
        this.clickMoving = false;
    }
    onClick(event: MouseEvent) {
    }
    onMove(event: MouseEvent) {

    }
    routeToTool(toolID: number, cb: Function, ...args: any) {

    }
    onKeyDown(event: KeyboardEvent) {
        console.log(event.code)
    }
    onWheelMove(event: WheelEvent) {

    }
} 