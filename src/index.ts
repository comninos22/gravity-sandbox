
import { RealObject } from "./model/object";
import { Canvas } from "./model/canvasContext";
import { Settings } from "./model/settings";
import { EventHandler } from "./model/eventHandler";
import { Utils } from "./model/utils";

let canvas = new Canvas(document.querySelector("canvas"));
let settings = Settings.getInstance();
(window as any).settings = settings

settings.setCosmicConstant(1)
settings.setScale(1e-12)
settings.setMass(1e35)
settings.setDensity(0.05)
settings.setSpeed(10)
canvas.generateParticles(500)
canvas.start();

