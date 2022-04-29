import { Settings } from "../settings";
import { EventHandler } from "../eventHandler";
import { Tool } from "../tools";
import { Utils } from "../utils";
import { RealObject } from "../object";
export class SelectTool implements Tool {
    settings: Settings;
    selectedParticle: number = 0;
    constructor() {
        this.settings = Settings.getInstance();
    }

    clickCommand(e: EventHandler): void {
        delete e.canvas.getRenderCallbacks()['highlight']
        let event = e.currentEvent as MouseEvent;
        let particles = e.getCanvas().getParticles();
        let [eX, eY] = [event.clientX, event.clientY]
        let clicked = particles.filter(v => {
            let [x, y] = v.getDisplayPos()
            let precision = 0.05
            return (eX - eX * precision) <= x && x <= (eX + eX * precision)
                && (eY - eY * precision) <= y && y <= (eY + eY * precision)
        })
        let highlighted;
        if (clicked.length > 1) {
            highlighted = clicked.map(v => {
                return {
                    ["particle"]: v,
                    ["distance"]: Utils.getDistance(...v.getDisplayPos(), eX, eY)
                }
            }).sort((a, b) => a.distance - b.distance)[0].particle
        } else if (clicked.length > 0) {
            highlighted = clicked[0];
        }
        e.canvas.getRenderCallbacks()['highlight'] = e.canvas.highlightParticle.bind(null, highlighted as RealObject)
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
        return 'Digit3';
    }
    getKeyboardFunctionsAndKeyCodes(e: EventHandler): [string, Function][] {
        return [
            ['KeyD', e.canvas.togglePause]
        ]
    }
    getToolID(): number {
        return 3
    }

}