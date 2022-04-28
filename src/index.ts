
import { RealObject } from "./model/object";
import { Canvas } from "./model/canvasContext";
import { Settings } from "./model/settings";
import { Utils } from "./model/utils";
import { EventHandler } from "./model/eventHandler";
import { UV } from "./model/vector";

let es = "click mousedown mouseup focus blur keydown change dblclick mousemove mouseover mouseout mousewheel keydown keyup keypress textInput touchstart touchmove touchend touchcancel resize scroll zoom select change submit reset"
let allEvents = es.split(" ");
console.log(allEvents);
let particles: Array<RealObject> = []
let canvas = new Canvas(document.querySelector("canvas"));
let eventHandler = new EventHandler(canvas);
let myWindow = window as any
myWindow.canvas = canvas;
for (let eventType of allEvents) {
    document.querySelector("canvas")?.addEventListener(eventType, eventHandler.switchEventType.bind(eventHandler))
}

document.querySelector("body")?.addEventListener("keydown", eventHandler.switchEventType.bind(eventHandler))
document.querySelector("body")?.addEventListener("wheel", eventHandler.switchEventType.bind(eventHandler))



document.querySelector("input.mass")!.addEventListener("change", (event) => {
    Settings.getInstance().setMass(Math.pow(10, +(event.target as HTMLInputElement).value))
})

document.querySelector("input.density")!.addEventListener("change", (event) => {
    Settings.getInstance().setDensity(+(event.target as HTMLInputElement).value)
})

document.querySelector("input.scale")!.addEventListener("mousedown", (event) => {
    document.querySelector("input.scale")!.addEventListener("mousemove", (event) => {
        canvas.clear();
        Settings.getInstance().setScale(+(event.target as HTMLInputElement).value)
        canvas.getParticles().forEach((v, i) => { v.setMass(v.getMass()) })
    })

})

document.querySelector("input.scale")!.addEventListener("mouseup", (event) => {
    let e = document.querySelector('input.scale');
    let clone = e!.cloneNode(true);
    e!.replaceWith(clone);
})

document.querySelector(".collisions")!.addEventListener("click", (event) => {
    if (collisions) {
        collisions = false;
        settings.setCollision(collisions);
    } else {
        collisions = true;
        settings.setCollision(collisions);
    }
})

document.querySelector(".leaveTraces")!.addEventListener("click", (event) => {
    if (checked) {
        checked = false;
        settings.setTracing(checked);
    } else {
        checked = true;
        settings.setTracing(checked);
    }
})

document.querySelector("input.pause")!.addEventListener("click", (event) => {
    if (!clicked) {
        canvas.pause()
        clicked = true;
    } else {
        canvas.continue()
        clicked = false;
    }
})

// Settings.getInstance().setDensity(.01)
// Settings.getInstance().setMass(1000000)
let settings = Settings.getInstance()

settings.setCosmicConstant(2)
settings.setScale(1e-4)
settings.setMass(1e10)
settings.setDensity(222)
console.log(settings);
var collisions = false;
var clicked = false;
var checked = true;

// (document.querySelector("input.mass") as HTMLInputElement).value = '' + settings.mass;
// document.querySelector("input.mass")!.dispatchEvent(new Event("change"));
// (document.querySelector("input.density") as HTMLInputElement).value = '' + settings.density;
// document.querySelector("input.density")!.dispatchEvent(new Event("change"));
// (document.querySelector("input.scale") as HTMLInputElement).value = '' + settings.scale;
// document.querySelector("input.scale")!.dispatchEvent(new Event("mouseup"));
// document.querySelector(".leaveTraces")!.dispatchEvent(new Event("click"));
// document.querySelector(".collisions")!.dispatchEvent(new Event("click"));




settings.canvasHeight = canvas.height;
settings.canvasWidth = canvas.width;

console.log(settings)
for (let i: number = 0; i < 500; i++) {
    let object: RealObject = RealObject.generateSelf(
        Utils.random(0, canvas.width/ settings.scale),
        Utils.random(0, canvas.height / settings.scale),
        Utils.random(-15, 51),
        Utils.random(-15, 15),
        Utils.random(settings.mass * 10, settings.mass * 10),
        settings.density
    );
    object.applyForce(new UV(0, 0))
    particles.push(object)
}
//(<any>window).defaultSettings.mass=20000;
//let object1: RealObject = new RealObject(150, 60, 0, 0, random(2, 3));
let object2 = new RealObject(canvas.width / 2, canvas.height / 2, 0, 0, 100000000, .001);
particles = [...particles, object2];
//console.log(particles[0].getDisplayPos());
canvas.setParticles(particles);
canvas.start();