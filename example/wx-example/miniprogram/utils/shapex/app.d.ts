import EventEmitter from 'eventemitter3';
import type { Display } from './object/display';
interface AppConstructorOptions {
    width?: number;
    height?: number;
    dpr?: boolean;
    onUpdate?: () => void;
    createImage?: () => HTMLImageElement;
}
export declare class App extends EventEmitter<{
    render: [];
}> {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    dpr: number;
    width: number;
    height: number;
    onUpdate: () => void;
    static createImage: () => HTMLImageElement;
    constructor({ width, height, dpr, createImage, onUpdate, }?: AppConstructorOptions);
    private beforeRender;
    private afterRender;
    children: Display[];
    add(object: Display): void;
    remove(object: Display): void;
    private update;
    toDataURL(type?: string, quality?: any): string;
    toDataURLAsync(type?: string, quality?: any): Promise<string>;
    onContext(fn: (ctx: CanvasRenderingContext2D) => any): void;
}
export {};
