export declare global {
    interface MyWindow extends Window {
        canvas;
    }
}

window.canvas = window.canvas || {};