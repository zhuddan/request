import type { TextStyle } from './style/text-style';
export declare function formatValue(val: string | number): string;
/**
 * 创造 [CSS-font](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font) 字符串
 * 由于 canvas 绘制的差异性部分属性不生效故舍弃
 */
export declare function createCanvasFontString({ fontFamily, fontSize, fontStyle, fontWeight, }: TextStyle): string;
export declare function calcMin(numbers: number[]): number;
export declare function calcMax(numbers: number[]): number;
/**
 * 计算差异
 * @param numbers
 */
export declare function calcDiff(numbers: number[]): number;
/**
 * 确保输入值在 min 和 max 之间，若超出边界则返回边界
 * @param input
 * @param min
 * @param max
 */
export declare function ensureBetween(input: number, min?: number, max?: number): number;
export declare function calcCenter(num1: number, num2: number): number;
export declare function createProxy<T extends object>(value: T, cb?: (property: string, newValue: any) => void): T;
