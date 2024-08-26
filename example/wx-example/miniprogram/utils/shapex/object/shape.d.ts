import type { IAbstractStyle, InputColor, StrokeInput } from '../style/abstract-style';
import type { FunctionKeys } from '../types';
import type { DisplayOptions } from './display';
import { Display } from './display';
type CanvasRenderingContext2DMethods = FunctionKeys<CanvasRenderingContext2D>;
interface PathData<T extends CanvasRenderingContext2DMethods> {
    action: T;
    args: any[];
}
type Methods = 'beginPath' | 'closePath' | 'moveTo' | 'fill' | 'stroke' | 'lineTo' | 'rect' | 'roundRect' | 'fillRect' | 'strokeRect' | 'arc' | 'arcTo' | 'bezierCurveTo' | 'ellipse';
type PathInstruction = PathData<Methods>;
export interface ShapeOptions extends DisplayOptions {
}
interface IShape {
    beginPath: () => Shape;
    closePath: () => Shape;
    moveTo: (...args: Parameters<CanvasRenderingContext2D['moveTo']>) => Shape;
    lineTo: (...args: Parameters<CanvasRenderingContext2D['lineTo']>) => Shape;
    stroke: (value?: StrokeInput | InputColor) => Shape;
    fill: (color?: InputColor) => Shape;
    rect: (...args: Parameters<CanvasRenderingContext2D['rect']>) => Shape;
    roundRect: (...args: Parameters<CanvasRenderingContext2D['roundRect']>) => Shape;
    arc: (...args: Parameters<CanvasRenderingContext2D['arc']>) => Shape;
    arcTo: (...args: Parameters<CanvasRenderingContext2D['arcTo']>) => Shape;
    bezierCurveTo: (...args: Parameters<CanvasRenderingContext2D['bezierCurveTo']>) => Shape;
    ellipse: (...args: Parameters<CanvasRenderingContext2D['ellipse']>) => Shape;
    fillRect: (...args: Parameters<CanvasRect['fillRect']>) => Shape;
    strokeRect: (...args: Parameters<CanvasRect['strokeRect']>) => Shape;
}
export declare class Shape extends Display implements IShape {
    constructor(options?: Partial<ShapeOptions>);
    addPath(...items: PathInstruction[]): void;
    beginPath(): Shape;
    closePath(): this;
    moveTo(...args: Parameters<CanvasRenderingContext2D['lineTo']>): this;
    lineTo(...args: Parameters<CanvasRenderingContext2D['lineTo']>): this;
    rect(...args: Parameters<CanvasRenderingContext2D['rect']>): this;
    roundRect(...args: Parameters<CanvasRenderingContext2D['roundRect']>): this;
    arc(...args: Parameters<CanvasRenderingContext2D['arc']>): this;
    arcTo(...args: Parameters<CanvasRenderingContext2D['arcTo']>): this;
    bezierCurveTo(...args: Parameters<CanvasRenderingContext2D['bezierCurveTo']>): this;
    ellipse(...args: Parameters<CanvasRenderingContext2D['ellipse']>): this;
    fillRect(...args: Parameters<CanvasRect['fillRect']>): this;
    strokeRect(...args: Parameters<CanvasRect['strokeRect']>): this;
    private pathInstruction;
    get _shouldUpdate(): boolean;
    protected _render(_ctx: CanvasRenderingContext2D): void;
    private _strokeStyle;
    set strokeStyle(value: StrokeInput | InputColor);
    get strokeStyle(): StrokeInput;
    transformWidth: number;
    transformHeight: number;
    updateTransformBounds(): void;
    private _fillStyle;
    set fillStyle(value: string | CanvasGradient | CanvasPattern | null);
    get fillStyle(): string | CanvasGradient | CanvasPattern | null;
    fill(color?: IAbstractStyle['fill']): this;
    stroke(value?: StrokeInput | InputColor): this;
    private _filter;
    set filter(value: string);
    get filter(): string;
}
export {};
