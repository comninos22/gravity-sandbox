import { Settings } from "../settings";
import { EventHandler } from "../eventHandler";
import { Tool } from "../tools";
export class GeneralTool implements Tool {
    settings: Settings;

    constructor() {
        this.settings = Settings.getInstance();
    }

    clickCommand(e: EventHandler): void {
        throw new Error("Method not implemented.");
    }
    dragCommand(e: EventHandler): void {
        throw new Error("Method not implemented.");
    }
    mouseDownCommand(e: EventHandler): void {
        throw new Error("Method not implemented.");
    }
    mouseUpCommand(e: EventHandler): void {
        throw new Error("Method not implemented.");
    }
    wheelCommand(e: EventHandler): void {
        throw new Error("Method not implemented.");
    }
    getShortcut(): string {
        return '';
    }
    getKeyboardFunctionsAndKeyCodes(e: EventHandler): [string, Function][] {
        return [
            ['Space', e.canvas.togglePause.bind(null, true)],
            ['KeyC', this.settings.clearTransform],
            ['KeyR', e.canvas.clearParticles],
            ['KeyT', this.settings.toggleTracing],
            ['KeyF', this.settings.toggleCollisions],

        ]
    }
    getToolID(): number {
        return -1
    }

}