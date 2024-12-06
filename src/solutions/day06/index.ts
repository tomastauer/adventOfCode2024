import { cloneGrid } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

type Direction = '^' | 'V' | '<' | '>';

export default class Day01 implements Solution {
	getNextCoords(y: number, x: number, direction: Direction) {
		switch (direction) {
			case '^':
				return { y: y - 1, x };
			case 'V':
				return { y: y + 1, x };
			case '<':
				return { y, x: x - 1 };
			case '>':
				return { y, x: x + 1 };
			default:
				return { y, x };
		}
	}

	rotate(direction: Direction) {
		switch (direction) {
			case '^':
				return '>';
			case 'V':
				return '<';
			case '<':
				return '^';
			case '>':
				return 'V';
			default:
				return direction;
		}
	}

	isWithinBounds(y: number, x: number, map: string[][]) {
		return y >= 0 && y < map.length && x >= 0 && x < map[0].length;
	}

	solve(map: string[][]): 'end' | 'cycle' {
		let y = map.findIndex((m) => m.includes('^'));
		let x = map[y].findIndex((m) => m === '^');
		let d: Direction = '^';

		const visited = new Set<string>();

		while (true) {
			const key = `${y}|${x}|${d}`;
			if (visited.has(key)) {
				return 'cycle';
			}
			map[y][x] = d;
			visited.add(key);

			let nextCoords = this.getNextCoords(y, x, d);
			if (!this.isWithinBounds(nextCoords.y, nextCoords.x, map)) {
				break;
			}

			while (map[nextCoords.y][nextCoords.x] === '#') {
				d = this.rotate(d);
				nextCoords = this.getNextCoords(y, x, d);
			}

			y = nextCoords.y;
			x = nextCoords.x;
		}

		return 'end';
	}

	solvePart1(input: string[]) {
		const map = input.map((i) => i.split(''));

		this.solve(map);

		return map.reduce((acc, curr) => {
			acc += curr.filter((c) => c !== '.' && c !== '#').length;
			return acc;
		}, 0);
	}

	solvePart2(input: string[]) {
		const map = input.map((i) => i.split(''));
		const origY = map.findIndex((m) => m.includes('^'));
		const origX = map[origY].findIndex((m) => m === '^');

		const defaultMap = cloneGrid(map);
		this.solve(defaultMap);

		const candidates: { x: number; y: number }[] = [];

		for (let y = 0; y < defaultMap.length; y++) {
			for (let x = 0; x < defaultMap[0].length; x++) {
				if (
					defaultMap[y][x] !== '.' && defaultMap[y][x] !== '#' &&
					!(y === origY && x === origX)
				) {
					candidates.push({ y, x });
				}
			}
		}

		const result = candidates.filter((c) => {
			const testMap = cloneGrid(map);

			testMap[c.y][c.x] = '#';
			return this.solve(testMap) === 'cycle';
		});

		return result.length;
	}
}
