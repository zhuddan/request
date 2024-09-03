import type { PointData } from './PointData';
import type { PointLike } from './PointLike';
export interface Observer<T> {
    _onUpdate: (point?: T) => void;
}
export declare class ObservablePoint implements PointLike {
    _x: number;
    _y: number;
    private readonly _observer;
    constructor(observer: Observer<ObservablePoint> | null, x?: number, y?: number);
    clone(observer?: Observer<ObservablePoint>): ObservablePoint;
    set(x?: number, y?: number): this;
    copyFrom(p: PointData): this;
    copyTo<T extends PointLike>(p: T): T;
    equals(p: PointData): boolean;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    [Symbol.iterator](): {
        next: () => {
            value: number;
            done: boolean;
        } | {
            done: boolean;
            value: undefined;
        };
    };
}
