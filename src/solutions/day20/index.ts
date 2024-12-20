import { get4Adjacent, isWithinBoundaries, makeGrid, print } from '../../utilities/array.ts';
import { isBetween } from '../../utilities/number.ts';
import { Solution } from '../../utilities/solver.ts';

type Point = {
	x: number;
	y: number;
};

type Cheat = {
	start: Point;
	end: Point;
};

export default class Day01 implements Solution {
	getCheatingCandidates(grid: string[][]) {
		const candidates: Cheat[] = [];
		for (let y = 1; y < grid.length - 1; y++) {
			for (let x = 1; x < grid[y].length - 1; x++) {
				if (grid[y][x] === '#') {
					get4Adjacent(x, y).filter((a) =>
						isWithinBoundaries(grid, a.x, a.y) && isBetween(a.x, 1, grid[y].length - 1) && isBetween(a.y, 1, grid.length - 1) &&
						grid[a.y][a.x] !== '#'
					).forEach((a) => {
						candidates.push({
							start: { x, y },
							end: { x: a.x, y: a.y },
						});
					});
				}
			}
		}

		return candidates;
	}

	getBaseWalkthrough(grid: string[][]) {
		let start: Point;
		let end: Point;

		const map = makeGrid(grid.length, grid[0].length, 0);

		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				if (grid[y][x] === 'S') {
					start = { x, y };
				}

				if (grid[y][x] === 'E') {
					end = { x, y };
				}

				if (grid[y][x] === '#') {
					map[y][x] = -1;
				}
			}
		}

		let current = start!;
		while (!(current.x === end!.x && current.y === end!.y)) {
			const next = get4Adjacent(current.x, current.y).find((a) => map[a.y][a.x] === 0 && !(a.x === start.x && a.y === start.y))!;
			map[next.y][next.x] = map[current.y][current.x] + 1;
			current = next;
		}

		return map;
	}

	solvePart1(input: string[]) {
		const parsed = input.map((i) => i.split(''));
		const grid = makeGrid(parsed.length, parsed[0].length, '.');

		for (let y = 0; y < parsed.length; y++) {
			for (let x = 0; x < parsed[y].length; x++) {
				grid[y][x] = parsed[y][x];
			}
		}

		const cheatCandidates = this.getCheatingCandidates(grid);
		const map = this.getBaseWalkthrough(grid);

		const result = new Map<number, number>();

		cheatCandidates.forEach((c) => {
			const adjacentPoints = get4Adjacent(c.start.x, c.start.y).filter((a) =>
				isWithinBoundaries(grid, a.x, a.y) && map[a.y][a.x] !== -1 && !(a.y === c.end.y && a.x === c.end.x)
			).map((a) => ({ x: a.x, y: a.y, v: map[a.y][a.x] })).sort((a, b) => b.v - a.v);

			const saves = adjacentPoints.map((a) => {
				return Math.max(map[c.end.y][c.end.x] - a.v - (Math.abs(a.x - c.end.x) + Math.abs(a.y - c.end.y)), 0);
			});

			const maxSave = Math.max(...saves);

			if (maxSave > 0) {
				result.set(maxSave, (result.get(maxSave) ?? 0) + 1);
			}
		});

		return result.entries().filter(([k]) => k >= 100).reduce((acc, [_, v]) => acc + v, 0);
	}

	solvePart2(input: string[]) {
		const parsed = input.map((i) => i.split(''));
		const grid = makeGrid(parsed.length, parsed[0].length, '.');

		for (let y = 0; y < parsed.length; y++) {
			for (let x = 0; x < parsed[y].length; x++) {
				grid[y][x] = parsed[y][x];
			}
		}

		const map = this.getBaseWalkthrough(grid);
		const result = new Map<number, number>();

		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				if (map[y][x] === -1) {
					continue;
				}

				for (let dy = Math.max(0, y - 20); dy <= Math.min(grid.length - 1, y + 20); dy++) {
					for (let dx = Math.max(0, x - 20); dx <= Math.min(grid[y].length - 1, x + 20); dx++) {
						if (map[dy][dx] === -1) {
							continue;
						}

						if (Math.abs(dy - y) + Math.abs(dx - x) > 20) {
							continue;
						}

						const distance = Math.abs(dy - y) + Math.abs(dx - x);
						const diff = map[dy][dx] - map[y][x];
						const save = diff - distance;
						if (save > 0) {
							result.set(save, (result.get(save) ?? 0) + 1);
						}
					}
				}
			}
		}

		return result.entries().filter(([k]) => k >= 100).reduce((acc, [_, v]) => acc + v, 0);
	}
}
