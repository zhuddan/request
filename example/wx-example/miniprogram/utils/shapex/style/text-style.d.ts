import type { Properties, Property } from 'csstype';
import type { IAbstractStyle } from './abstract-style';
import { AbstractStyle } from './abstract-style';
export interface TextStyleOptions extends IAbstractStyle {
    /**
     * @description 字体
     * [MDN Reference](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-family)
     */
    fontFamily: Properties['fontFamily'];
    /**
     * @description 字体大小 当值为 number 时单位为px
     * [MDN Reference](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-size)
     */
    fontSize: Properties['fontSize'] | (number & {});
    /**
     * @description 字体样式
     * [MDN Reference](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-style)
     */
    fontStyle: Properties['fontStyle'];
    /**
     * @description 字体的粗细程度
     * [MDN Reference](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-weight)
     */
    fontWeight: Properties['fontWeight'];
    /**
     * 指定绘制文本时字体如何被扩展或压缩
     * [MDN Reference](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fontStretch)
     */
    fontStretch: CanvasFontStretch;
    /**
     * 用于指定渲染文本的替代大写形式
     * [MDN Reference](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fontVariantCaps)
     */
    fontVariantCaps: CanvasFontVariantCaps;
    /**
     * 用于指定绘制文本时字母之间的间距
     * [MDN Reference](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/letterSpacing)
     */
    letterSpacing: string | number;
    /**
     * 指定绘制文本时单词之间的间距
     * [MDN Reference](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/wordSpacing)
     */
    wordSpacing: string | number;
    /**
     * 文本时文本的对齐方式
     * [MDN Reference](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/textAlign)
     */
    textAlign: CanvasTextAlign;
    lineHeight: number;
    wordWrap: boolean;
    wordWrapWidth: number;
}
export declare class TextStyle extends AbstractStyle implements TextStyleOptions {
    static defaultTextStyle: TextStyleOptions;
    _isStroke: boolean;
    constructor(style?: Partial<TextStyleOptions>);
    reset(): void;
    protected readonly textBaseline = "top";
    private _fontSize;
    set fontSize(value: Property.FontSize<0 | (string & {})> | (number & {}) | undefined);
    get fontSize(): Property.FontSize<0 | (string & {})> | (number & {}) | undefined;
    private _fontFamily;
    set fontFamily(value: Property.FontFamily | undefined);
    get fontFamily(): Property.FontFamily | undefined;
    private _fontStyle;
    set fontStyle(value: Property.FontStyle | undefined);
    get fontStyle(): Property.FontStyle | undefined;
    private _fontWeight;
    set fontWeight(value: Property.FontWeight | undefined);
    get fontWeight(): Property.FontWeight | undefined;
    private _fontStretch;
    set fontStretch(value: CanvasFontStretch);
    get fontStretch(): CanvasFontStretch;
    private _fontVariantCaps;
    set fontVariantCaps(value: CanvasFontVariantCaps);
    get fontVariantCaps(): CanvasFontVariantCaps;
    private _letterSpacing;
    set letterSpacing(value: string | number);
    get letterSpacing(): string | number;
    private _wordSpacing;
    set wordSpacing(value: string | number);
    get wordSpacing(): string | number;
    private _textAlign;
    set textAlign(value: CanvasTextAlign);
    get textAlign(): CanvasTextAlign;
    private _lineHeight;
    set lineHeight(value: number);
    get lineHeight(): number;
    private _wordWrap;
    set wordWrap(value: boolean);
    get wordWrap(): boolean;
    private _wordWrapWidth;
    set wordWrapWidth(value: number);
    get wordWrapWidth(): number;
    clone(): TextStyle;
    render(ctx: CanvasRenderingContext2D): this;
}
