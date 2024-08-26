import EventEmitter from 'eventemitter3';
import type { App } from '../app';
import type { Observer } from '../coordinate/ObservablePoint';
import { ObservablePoint } from '../coordinate/ObservablePoint';
import type { PointData } from '../coordinate/PointData';
interface ShadowType {
    /**
     * [CanvasRenderingContext2D.shadowOffsetX](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/shadowOffsetX)
     */
    x?: number;
    /**
     * [CanvasRenderingContext2D.shadowOffsetY](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/shadowOffsetY)
     */
    y?: number;
    /**
     * [CanvasRenderingContext2D.shadowBlur](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/shadowBlur)
     */
    blur?: number;
    /**
     * [CanvasRenderingContext2D.shadowColor](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/shadowColor)
     */
    color?: string;
}
/**
 * [单位矩阵变化](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/setTransform)
 */
export interface DisplayOptions {
    visible?: boolean;
    x?: number;
    y?: number;
    position?: PointData;
    rotation?: number;
    scale?: PointData | number;
    anchor?: PointData | number;
    pivot?: PointData | number;
    skew?: PointData;
    alpha?: number;
    shadow?: ShadowType;
}
export declare abstract class Display extends EventEmitter<{
    ready: [];
}> implements Observer<ObservablePoint> {
    constructor(options?: DisplayOptions);
    /**
     * 更新优化
     */
    private get __shouldUpdate();
    /**
     * 更新优化
     * 如果_shouldRender为true 则渲染
     * 否则跳过渲染
     */
    abstract get _shouldUpdate(): boolean;
    get shouldUpdate(): boolean;
    protected _dirty: boolean;
    set dirty(value: boolean);
    get dirty(): boolean;
    set x(value: number);
    get x(): number;
    set y(value: number);
    get y(): number;
    private _position;
    set position(value: PointData);
    get position(): ObservablePoint;
    private _scale;
    set scale(value: PointData | number);
    get scale(): ObservablePoint;
    private _skew;
    set skew(value: PointData);
    get skew(): ObservablePoint;
    private _alpha;
    set alpha(value: number);
    get alpha(): number;
    private _rotation;
    set rotation(value: number);
    get rotation(): number;
    private _anchor;
    set anchor(value: PointData | number);
    get anchor(): ObservablePoint;
    private _pivot;
    set pivot(value: PointData | number);
    get pivot(): ObservablePoint;
    private _shadow;
    set shadow(value: ShadowType);
    get shadow(): ShadowType;
    _onUpdate(_point?: ObservablePoint | undefined): void;
    _app: App | null;
    private _visible;
    get visible(): boolean;
    set visible(value: boolean);
    protected _shouldUpdateBounds: boolean;
    protected shouldUpdateBounds(): void;
    private _baseRender;
    render(ctx: CanvasRenderingContext2D): void;
    _renderId: number;
    protected abstract _render(ctx: CanvasRenderingContext2D): void;
    /**
     * 同于形变转换的宽度
     */
    abstract transformWidth: number;
    /**
     * 同于形变转换的高度
     */
    abstract transformHeight: number;
    /**
     * 同于形变转换的边界
     */
    abstract updateTransformBounds(): void;
    onAdd(_app: App): void;
    onRemove(): void;
    destroy(): void;
}
export {};
