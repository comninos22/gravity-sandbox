import { Canvas } from "./canvasContext";
import { ToolManager } from "./tools";
import { Utils } from "./utils";
export class EventHandler {
    public canvas: Canvas;
    private clickDown = false;
    private clickMoving = false;
    public prevClientX = 0;
    public prevClientY = 0;
    public currentEvent: Event | null = null;
    constructor(canvas: Canvas) {
        this.canvas = canvas;
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
    switchEventType(e: Event) {
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