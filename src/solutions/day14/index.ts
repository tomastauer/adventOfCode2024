import { print } from '../../utilities/array.ts';
import { makeGrid } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

const width = 101;
const height = 103;

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const parsed = input.map((i) => {
			const [position, vector] = i.split(' ').map((n) => n.split('=')[1]).map((n) => n.split(',').map((n) => parseInt(n))).map(([x, y]) => ({ x, y }));
			return { position, vector };
		});

		parsed.forEach((p) => {
			p.position.x = (((p.position.x + (p.vector.x) * 100) % width) + width) % width;
			p.position.y = (((p.position.y + (p.vector.y) * 100) % height) + height) % height;
		});

		const y = Math.trunc(height / 2);
		const x = Math.trunc(width / 2);

		const top = parsed.filter((p) => p.position.y < y);
		const bottom = parsed.filter((p) => p.position.y > y);

		const topLeft = top.filter((p) => p.position.x < x);
		const topRight = top.filter((p) => p.position.x > x);

		const bottomLeft = bottom.filter((p) => p.position.x < x);
		const bottomRight = bottom.filter((p) => p.position.x > x);

		return topLeft.length * topRight.length * bottomLeft.length * bottomRight.length;
	}

	getDensities(grid: string[][]) {
		const densityGrid = makeGrid(11, 11, 0);

		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				densityGrid[Math.trunc(y / 10)][Math.trunc(x / 10)] += grid[y][x] === '#' ? 1 : 0;
			}
		}

		return densityGrid;
	}

	solvePart2(input: string[]) {
		const parsed = input.map((i) => {
			const [position, vector] = i.split(' ').map((n) => n.split('=')[1]).map((n) => n.split(',').map((n) => parseInt(n))).map(([x, y]) => ({ x, y }));
			return { position, vector };
		});

		const grid = makeGrid(height, width, '.');

		for (let i = 1; i < 10000; i++) {
			parsed.forEach((p) => {
				grid[p.position.y][p.position.x] = '.';

				p.position.x = (((p.position.x + p.vector.x) % width) + width) % width;
				p.position.y = (((p.position.y + p.vector.y) % height) + height) % height;

				grid[p.position.y][p.position.x] = '#';
			});

			const densityGrid = this.getDensities(grid).flat();
			if (Math.max(...densityGrid) > 50) {
				return i;
			}
		}

		return 0;
	}
}
