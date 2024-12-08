import { isWithinBoundaries } from '../../utilities/array.ts';
import { getPairs } from '../../utilities/combinatorics.ts';
import { Solution } from '../../utilities/solver.ts';

type Point = {
	x: number;
	y: number;
};

export default class Day01 implements Solution {
	parse(input: string[]) {
		const map = input.map((i) => i.split(''));
		const antennas: Record<string, Point[]> = {};

		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				const code = map[y][x];
				if (code !== '.') {
					(antennas[code] = antennas[code] || []).push({ x, y });
				}
			}
		}

		return { map, antennas };
	}

	solvePart1(input: string[]) {
		const { map, antennas } = this.parse(input);
		const positions = new Set<string>();

		Object.entries(antennas).forEach(([_, points]) => {
			getPairs(points).forEach(([a, b]) => {
				const dx = a.x - b.x;
				const dy = a.y - b.y;

				const newX1 = a.x + dx;
				const newY1 = a.y + dy;

				const newX2 = b.x - dx;
				const newY2 = b.y - dy;

				if (isWithinBoundaries(map, newX1, newY1)) {
					positions.add(`${newX1},${newY1}`);
				}

				if (isWithinBoundaries(map, newX2, newY2)) {
					positions.add(`${newX2},${newY2}`);
				}
			});
		});

		return positions.size;
	}

	solvePart2(input: string[]) {
		const { map, antennas } = this.parse(input);
		const positions = new Set<string>();

		Object.entries(antennas).forEach(([_, points]) => {
			getPairs(points).forEach(([a, b]) => {
				positions.add(`${a.x},${a.y}`);
				positions.add(`${b.x},${b.y}`);

				const dx = a.x - b.x;
				const dy = a.y - b.y;

				let newX1 = a.x + dx;
				let newY1 = a.y + dy;

				let newX2 = b.x - dx;
				let newY2 = b.y - dy;

				while (isWithinBoundaries(map, newX1, newY1)) {
					positions.add(`${newX1},${newY1}`);
					newX1 = newX1 + dx;
					newY1 = newY1 + dy;
				}

				while (isWithinBoundaries(map, newX2, newY2)) {
					positions.add(`${newX2},${newY2}`);
					newX2 = newX2 - dx;
					newY2 = newY2 - dy;
				}
			});
		});

		return positions.size;
	}
}
