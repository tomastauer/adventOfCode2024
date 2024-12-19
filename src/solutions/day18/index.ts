import { get4Adjacent, isWithinBoundaries, makeGrid } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const bytes = input.map((line) => {
			const [x, y] = line.split(',');
			return { x: parseInt(x), y: parseInt(y) };
		});

		const grid = makeGrid(71, 71, Number.MAX_SAFE_INTEGER);

		bytes.slice(0, 1024).forEach(({ x, y }) => grid[y][x] = -1);

		grid[0][0] = 0;
		const queue = [{ x: 0, y: 0 }];

		while (queue.length > 0) {
			const point = queue.shift()!;

			const current = grid[point.y][point.x];
			get4Adjacent(point.x, point.y).filter(({ x, y }) => isWithinBoundaries(grid, x, y) && grid[y][x] !== -1).forEach(({ x, y }) => {
				if (grid[y][x] > current + 1) {
					grid[y][x] = current + 1;
					queue.push({ x, y });
				}
			});
		}

		return grid[70][70];
	}

	solvePart2(input: string[]) {
		const bytes = input.map((line) => {
			const [x, y] = line.split(',');
			return { x: parseInt(x), y: parseInt(y) };
		});

		for (let i = 1024; i < bytes.length; i++) {
			const grid = makeGrid(71, 71, Number.MAX_SAFE_INTEGER);
			bytes.slice(0, i).forEach(({ x, y }) => grid[y][x] = -1);

			grid[0][0] = 0;
			const queue = [{ x: 0, y: 0 }];

			while (queue.length > 0) {
				const point = queue.shift()!;

				const current = grid[point.y][point.x];
				get4Adjacent(point.x, point.y).filter(({ x, y }) => isWithinBoundaries(grid, x, y) && grid[y][x] !== -1).forEach(({ x, y }) => {
					if (grid[y][x] > current + 1) {
						grid[y][x] = current + 1;
						queue.push({ x, y });
					}
				});
			}

			if (grid[70][70] === Number.MAX_SAFE_INTEGER) {
				return input[i - 1];
			}
		}

		return 0;
	}
}
