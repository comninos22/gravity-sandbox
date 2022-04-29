import { RealObject } from "./object";
import { Settings } from "./settings";
import { Utils } from "./utils";
import { EventHandler } from "./eventHandler";
import { GeneralTool } from "./tools/generalTool";
import { MoveTool } from "./tools/moveTool"
import { ThrowTool } from "./tools/throwTool"
import { SelectTool } from "./tools/selectTool"
import { Canvas } from "./canvasContext";

export interface Tool {
    clickCommand(e: EventHandler): void;
    dragCommand(e: EventHandler): void;
    mouseDownCommand(e: EventHandler): void;
    mouseUpCommand(e: EventHandler): void;
    wheelCommand(e: EventHandler): void;
    getShortcut(): string;
    getKeyboardFunctionsAndKeyCodes(e: EventHandler): Array<[string, Function]>
    getToolID(): number;
}
export class ToolManager {
    private selectedTool: Tool;
    private allTools: Array<Tool>;
    settings: Settings;
    canvas: Canvas;
    constructor(canvas: Canvas, tool: Tool = new MoveTool()) {
        this.settings = Settings.getInstance();
        this.canvas = canvas;
        this.selectedTool = tool;
        this.allTools = [
            new GeneralTool,
            new MoveTool,
            new ThrowTool,
            new SelectTool
        ]
        this.checkShortCuts();
    }
    checkShortCuts() {
        let s = new Set();
        for (let shortcut of this.allTools.map(v => v.getShortcut())) {
            s.add(shortcut);
        }
        if (s.size != this.allTools.length) {
            throw new Error("Overlapping shortcuts")
        }
    }
    setTool(toolID: number) {
        for (let tool of this.allTools) {

        }
    }
    detectShortCuts() {

    }
    public execute(e: EventHandler) {
        switch (e.currentEvent!.type.toLocaleLowerCase()) {
            case "mousedown":
                try {
                    this.selectedTool.mouseDownCommand(e);
                } catch (error) { }
                break;
            case "mouseup":
                try {
                    this.selectedTool.mouseUpCommand(e);
                } catch (error) { }
                break;
            case "mousemove":
                if (e.isDragging()) {
                    try {
                        this.selectedTool.dragCommand(e);
                    } catch (error) {
                    }
                }
                break;
            case "click":
                try {
                    this.selectedTool.clickCommand(e);
                } catch (error) {

                }
                break;
            case "wheel":
                try {
                    this.selectedTool.wheelCommand(e);
                } catch (error) {
                    this.handleWheel(e);
                }
                //this.selectedTool.wheelCommand(e);
                break;
            case "keydown":
                this.handleKeyDown(e);
                break;
        }

    }
    private handleWheel(e: EventHandler) {
        this.canvas.pause()
        this.canvas.clear();
        this.settings.setScale(this.settings.scale - (100 * this.settings.scale / (e.currentEvent as WheelEvent).deltaY))
        this.canvas.setParticles(this.canvas.getParticles());
        this.canvas.continue(true);
    }
    private handleKeyDown(e: EventHandler) {
        let event = e.currentEvent as KeyboardEvent;
        if (this.tryToExecuteKeyFunction(this.selectedTool, e)) {
            return
        }
        for (let tool of this.allTools) {
            console.log(tool.getShortcut(), event.code)
            if (tool.getShortcut() == event.code) {
                this.canvas.clearRenderCallbacks()
                this.selectedTool = tool;
                return;
            }
            if (this.tryToExecuteKeyFunction(tool, e)) {
                return
            }
        }
    }
    private tryToExecuteKeyFunction(tool: Tool, e: EventHandler) {
        let keyBindsAndFunctions = tool.getKeyboardFunctionsAndKeyCodes(e);
        let event = e.currentEvent as KeyboardEvent;
        for (let x of keyBindsAndFunctions) {
            let key = x[0];
            let cb = x[1];
            if (event.code == key) {
                cb();
                return true;
            }
        }
        return false;
    }
}

