import { Settings } from "../settings";
import { EventHandler } from "../eventHandler";
import { Tool } from "../tools";
export class MoveTool implements Tool {
    settings: Settings;

    constructor() {
        this.settings = Settings.getInstance();
    }

    clickCommand(e: EventHandler): void { };

    dragCommand(e: EventHandler): void {
        e.canvas.clear();
        let event = e.currentEvent as MouseEvent;
        this.settings.setTransformX((event.clientX - e.prevClientX) / (this.settings.scale))
        this.settings.setTransformY((event.clientY - e.prevClientY) / (this.settings.scale))
        e.prevClientX = (event.clientX);
        e.prevClientY = (event.clientY);
    };
    wheelCommand(e: EventHandler): void {
        throw new Error("Method not implemented.");

    };

    mouseDownCommand(e: EventHandler): void {
        throw new Error("Method not implemented.");
    };

    mouseUpCommand(e: EventHandler): void {
        throw new Error("Method not implemented.");
    };

    getShortcut(): string {
        return 'Digit1'
    }
    getKeyboardFunctionsAndKeyCodes(): Array<[string, Function]> {

        return [
            ["KeyW", this.settings.setTransformY.bind(this.settings, 100 / this.settings.scale)],
            ["KeyS", this.settings.setTransformY.bind(this.settings, -100 / this.settings.scale)],
            ["KeyA", this.settings.setTransformX.bind(this.settings, 100 / this.settings.scale)],
            ["KeyD", this.settings.setTransformX.bind(this.settings, -100 / this.settings.scale)],
        ]
    }
    getToolID(): number {
        return 0;
    }

}