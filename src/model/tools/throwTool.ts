import { Settings } from "../settings";
import { EventHandler } from "../eventHandler";
import { Tool } from "../tools";
import { RealObject } from "../object";
export class ThrowTool implements Tool {
    settings: Settings;
    speedLine: {} = {};
    constructor() {
        this.settings = Settings.getInstance();
    }

    wheelCommand(e: EventHandler): void {
        throw new Error("Method not implemented.");
    }

    dragCommand(e: EventHandler): void {
        delete e.canvas.renderCallbacks['line']
        let event = e.currentEvent as MouseEvent;
        this.setSpeedLine(e.prevClientX, e.prevClientY, event.clientX, event.clientY)
        e.canvas.renderCallbacks['line'] = e.canvas.renderLine.bind(null, this.speedLine);
    };

    clickCommand(e: EventHandler): void { };

    mouseDownCommand(e: EventHandler): void {
    };

    mouseUpCommand(e: EventHandler): void {
        let event = e.currentEvent as MouseEvent;
        let x = e.prevClientX
        let y = e.prevClientY;
        let speedX = ((event.clientX - e.prevClientX) / 10) / this.settings.scale;
        let speedY = ((event.clientY - e.prevClientY) / 10) / this.settings.scale;
        console.log(speedX,speedY)
        let newObj=                RealObject.generateSelf(x / this.settings.scale - this.settings.transformX, y / this.settings.scale - this.settings.transformY, speedX, speedY, this.settings.mass, this.settings.density)
        console.log(newObj)
        e.canvas.setParticles(
            [
                ...e.canvas.getParticles(),
                newObj
            ]
        );
        console.log(e.canvas.getParticles())
        delete e.canvas.renderCallbacks['line']
    };
    getShortcut(): string {
        return "Digit2"
    };
    getKeyboardFunctionsAndKeyCodes(): Array<[string, Function]> {
        return [

        ]
    }
    getToolID(): number {
        return 1
    };
    setSpeedLine(x1: number, y1: number, x2: number, y2: number) {
        this.speedLine = {
            x1, y1, x2, y2
        }
    }
}