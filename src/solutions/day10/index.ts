import { get4Adjacent, isWithinBoundaries } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solve(input: string[]) {
		const trailheads: { x: number; y: number }[] = [];
		const parsed = input.map((r, y) =>
			r.split('').map((c, x) => {
				const n = { n: parseInt(c) };
				if (n.n === 0) {
					trailheads.push({ x, y });
				}
				return n;
			})
		);

		return trailheads.map(({ x, y }) => {
			let peaks = new Map<{ n: number }, number>();

			const queue = [{ x, y }];
			while (queue.length) {
				const item = queue.shift()!;

				const foundItem = parsed[item.y][item.x];
				if (foundItem.n === 9) {
					peaks.set(foundItem, (peaks.get(foundItem) ?? 0) + 1);
					continue;
				}

				queue.push(
					...get4Adjacent(item.x, item.y).filter(({ x, y }) =>
						isWithinBoundaries(parsed, x, y) &&
						parsed[y][x].n === foundItem.n + 1
					),
				);
			}

			return peaks;
		});
	}

	solvePart1(input: string[]) {
		return this.solve(input).reduce((agg, curr) => agg + curr.size, 0);
	}

	solvePart2(input: string[]) {
		return this.solve(input).reduce(
			(agg, curr) =>
				agg + Array.from(curr.values()).reduce((a, c) => a + c),
			0,
		);
	}
}
