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
    let inset = ``;
    const insetDir = (u: number) => {
        const percent = (u: number) => u * 100
        if (params.direction == `UP`) inset = `inset( 0% 0% ${percent(u)}% 0%)`;
        else if (params.direction == `DOWN`) inset = `inset(${percent(u)}% 0% 0% 0%)`;
        else if (params.direction == `LEFT`) inset = `inset( 0% ${percent(u)}% 0% 0%)`;
        else if (params.direction == `RIGHT`) inset = `inset( 0% 0% 0% ${percent(u)}%)`;
        return inset;
    };

    return {
        delay: params.delay || 0,
        duration: params.duration || 400,
        easing: params.easing || quintOut,
        direction: params.direction || 'DOWN',
        css: (t: number, u: number) => `
			clip-path: ${insetDir(u)};
		`
    };
}
