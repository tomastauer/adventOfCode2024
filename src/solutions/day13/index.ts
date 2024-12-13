import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	isInteger(n: number) {
		return n === Math.trunc(n);
	}

	solve(input: string[], addition: number) {
		const parsed = input.join('\n').split('\n\n').map((e) =>
			e.split('\n').map((l) => {
				const ex = /X(\+|=)(?<x>\d+), Y(\+|=)(?<y>\d+)/gm.exec(l)!.groups!;
				return {
					x: parseInt(ex.x),
					y: parseInt(ex.y),
				};
			})
		).map(([a, b, p]) => ({ a, b, p }));

		parsed.forEach(({ p }) => {
			p.x += addition;
			p.y += addition;
		});

		return parsed.map(({ a, b, p }) => {
			const d1 = p.y * a.x - p.x * a.y;
			const y1 = d1 === 0 ? 0 : (d1 / (a.x * b.y - a.y * b.x));
			const x1 = (p.x - b.x * y1) / a.x;

			const d2 = p.x * b.y - p.y * b.x;
			const x2 = d2 === 0 ? 0 : (d2 / (a.x * b.y - a.y * b.x));
			const y2 = (p.y - a.y * x2) / b.y;

			const price1 = (this.isInteger(y1) && this.isInteger(x1)) ? 3 * x1 + y1 : 0;
			const price2 = (this.isInteger(y2) && this.isInteger(x2)) ? 3 * x2 + y2 : 0;

			return price1 === 0 && price2 === 0 ? 0 : Math.min(price1, price2);
		}).reduce((acc, curr) => acc + curr);
	}

	solvePart1(input: string[]) {
		return this.solve(input, 0);
	}

	solvePart2(input: string[]) {
		return this.solve(input, 10000000000000);
	}
}
