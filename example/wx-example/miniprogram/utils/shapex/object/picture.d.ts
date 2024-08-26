import type { Properties } from 'csstype';
import type { PointData } from '../coordinate/PointData';
import { ObservablePoint } from '../coordinate/ObservablePoint';
import type { DisplayOptions } from './display';
import { Display } from './display';
interface PictureOptions extends DisplayOptions {
    size?: PointData;
    slice?: PointData;
    sliceSize?: PointData;
    objectFit?: Properties['objectFit'];
    rounded?: number;
}
export declare class Picture extends Display {
    private options?;
    constructor(maybeImage: HTMLImageElement | string, options?: PictureOptions | undefined);
    private image;
    private _size;
    private _imageSize;
    set size(value: PointData);
    get size(): ObservablePoint;
    private _slice;
    set slice(value: PointData);
    get slice(): ObservablePoint;
    private _sliceSize;
    set sliceSize(value: PointData);
    get sliceSize(): ObservablePoint;
    private _objectFit;
    set objectFit(value: import("csstype").Property.ObjectFit | undefined);
    get objectFit(): import("csstype").Property.ObjectFit | undefined;
    private _rounded;
    set rounded(value: number);
    _onUpdate(_point?: ObservablePoint | undefined): void;
    get rounded(): number;
    private _ready;
    private _onImageComplete;
    get _shouldUpdate(): boolean;
    private get _isSlice();
    protected _render(ctx: CanvasRenderingContext2D): void;
    transformWidth: number;
    transformHeight: number;
    updateTransformBounds(): void;
}
export {};
