import { get4Adjacent, isWithinBoundaries } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

type Point = {
	x: number;
	y: number;
};

type Fence = {
	id: number;
	position: Point;
	direction: 'up' | 'down' | 'left' | 'right';
};

export default class Day01 implements Solution {
	serialize(point: Point) {
		return `${point.x}|${point.y}`;
	}

	deserialize(point: string) {
		const [x, y] = point.split('|').map((n) => parseInt(n));
		return { x, y };
	}

	solve(input: string[]) {
		const parsed = input.map((r) => r.split(''));
		const visited = new Set<string>();
		const toVisit = new Set<string>();
		const gardens: { id: string; perimeter: number; area: number; fences: Fence[] }[] = [];

		for (let y = 0; y < parsed.length; y++) {
			for (let x = 0; x < parsed[y].length; x++) {
				toVisit.add(this.serialize({ x, y }));
			}
		}

		while (toVisit.size > 0) {
			const point = [...toVisit.values()][0];
			const deserialized = this.deserialize(point);
			const item = parsed[deserialized.y][deserialized.x];

			const garden = { id: item, perimeter: 0, area: 0, fences: [] as Fence[] };
			const queue = [point];
			while (queue.length > 0) {
				const item = queue.shift()!;
				if (visited.has(item)) {
					continue;
				}

				const deserialized = this.deserialize(item);
				toVisit.delete(item);
				visited.add(item);

				const adjacents = get4Adjacent(deserialized.x, deserialized.y)
					.filter(({ x, y }) => isWithinBoundaries(parsed, x, y) && parsed[y][x] === garden.id);

				garden.fences.push(
					...get4Adjacent(deserialized.x, deserialized.y).filter(({ x, y }) => !adjacents.find((a) => a.x === x && a.y === y)).map((position) => ({
						id: 0,
						position: deserialized,
						direction: this.getDirection(deserialized, position),
					})),
				);

				garden.perimeter += 4 - adjacents.length;
				garden.area++;

				queue.push(...adjacents.filter((a) => isWithinBoundaries(parsed, a.x, a.y) && !visited.has(this.serialize(a))).map((a) => this.serialize(a)));
			}

			gardens.push(garden);
		}

		return gardens;
	}

	solvePart1(input: string[]) {
		const gardens = this.solve(input);

		return gardens.reduce((acc, curr) => acc + curr.area * curr.perimeter, 0);
	}

	getDirection(a: Point, b: Point): Fence['direction'] {
		return a.x === b.x ? a.y > b.y ? 'up' : 'down' : a.x > b.x ? 'left' : 'right';
	}

	reduceFences(fences: Fence[]): Fence[] {
		let fence = fences[0];
		let id = 1;
		while (fence) {
			const horizontal = fence.direction === 'up' || fence.direction === 'down';
			if (horizontal) {
				const candidates = fences.filter((f) => f.direction === fence.direction && fence.position.y === f.position.y).sort((a, b) =>
					a.position.x - b.position.x
				);
				const lower = candidates.filter((c) => c.position.x < fence.position.x).reverse();
				const higher = candidates.filter((c) => c.position.x > fence.position.x);

				lower.filter((c, id) => c.position.x === fence.position.x - id - 1).forEach((c) => c.id = id);
				higher.filter((c, id) => c.position.x === fence.position.x + id + 1).forEach((c) => c.id = id);
			} else {
				const candidates = fences.filter((f) => f.direction === fence.direction && fence.position.x === f.position.x).sort((a, b) =>
					a.position.y - b.position.y
				);
				const lower = candidates.filter((c) => c.position.y < fence.position.y).reverse();
				const higher = candidates.filter((c) => c.position.y > fence.position.y);

				lower.filter((c, id) => c.position.y === fence.position.y - id - 1).forEach((c) => c.id = id);
				higher.filter((c, id) => c.position.y === fence.position.y + id + 1).forEach((c) => c.id = id);
			}

			fence.id = id;
			fence = fences.find((f) => f.id === 0)!;

			id++;
		}

		return fences;
	}

	solvePart2(input: string[]) {
		const gardens = this.solve(input);

		gardens.forEach((g) => {
			g.fences = this.reduceFences(g.fences);
		});

		return gardens.reduce((acc, curr) => acc + curr.area * Math.max(...curr.fences.map((c) => c.id)), 0);
	}
}
