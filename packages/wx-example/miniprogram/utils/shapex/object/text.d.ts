import type { TextStyleOptions } from '../style/text-style';
import { TextStyle } from '../style/text-style';
import type { DisplayOptions } from './display';
import { Display } from './display';
export interface TextOptions extends DisplayOptions {
    text: string;
    style?: Partial<TextStyleOptions> | TextStyle;
}
export declare class Text extends Display {
    constructor(options: TextOptions);
    private _style;
    set style(style: Partial<TextStyleOptions> | TextStyle);
    get style(): TextStyle;
    private _text;
    set text(text: string);
    get text(): string;
    get _shouldUpdate(): boolean;
    getSplitText(ctx: CanvasRenderingContext2D): string[];
    _render(ctx: CanvasRenderingContext2D): void;
    updateTransformBounds(): void;
    transformWidth: number;
    transformHeight: number;
}
