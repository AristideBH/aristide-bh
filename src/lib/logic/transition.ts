import { quintOut } from 'svelte/easing';

export function clipPath(
    node: Node,
    params: {
        duration?: number;
        direction?: "UP" | "DOWN" | 'LEFT' | "RIGHT";
        delay?: number;
        easing?: (arg1: number) => number
    }
) {
    const insetDir = (u: number) => {
        const percent = (u: number) => u * 100;
        if (params.direction == `UP`) return `inset( 0% 0% ${percent(u)}% 0%)`;
        else if (params.direction == `DOWN`) return `inset(${percent(u)}% 0% 0% 0%)`;
        else if (params.direction == `LEFT`) return `inset( 0% ${percent(u)}% 0% 0%)`;
        else if (params.direction == `RIGHT`) return `inset( 0% 0% 0% ${percent(u)}%)`;
        return '';
    };

    return {
        delay: params.delay || 0,
        duration: params.duration || 400,
        easing: params.easing || quintOut,
        direction: params.direction || 'DOWN',
        css: (_: number, u: number) => `clip-path: ${insetDir(u)};`
    };
}
