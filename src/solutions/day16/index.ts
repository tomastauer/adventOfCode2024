import { makeUnique } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

type Point = {
	x: number;
	y: number;
};

type Location = {
	position: Point;
	direction: 'N' | 'E' | 'S' | 'W';
	score: number;
	visitedTiles: Point[];
};

export default class Day01 implements Solution {
	getRotations(direction: 'N' | 'E' | 'S' | 'W'): Location['direction'][] {
		switch (direction) {
			case 'N':
				return ['W', 'E'];
			case 'E':
				return ['N', 'S'];
			case 'S':
				return ['E', 'W'];
			case 'W':
				return ['S', 'N'];
		}
	}

	getNextPosition(position: Point, direction: 'N' | 'E' | 'S' | 'W') {
		switch (direction) {
			case 'N':
				return { x: position.x, y: position.y - 1 };
			case 'E':
				return { x: position.x + 1, y: position.y };
			case 'S':
				return { x: position.x, y: position.y + 1 };
			case 'W':
				return { x: position.x - 1, y: position.y };
		}
	}

	solve(input: string[]) {
		const grid = input.map((line) => line.split(''));
		const start = { x: grid.flat().indexOf('S') % grid[0].length, y: Math.floor(grid.flat().indexOf('S') / grid[0].length) };

		const visited = new Map<string, number>();
		const queue: Location[] = [{ position: start, direction: 'E', score: 0, visitedTiles: [start] }];
		const locations: Location[] = [];

		while (queue.length > 0) {
			const current = queue.shift()!;

			const i = grid[current.position.y][current.position.x];
			if (i === '#') {
				continue;
			}

			if (i === 'E') {
				locations.push(current);
				continue;
			}

			const serialized = current.position.y + ',' + current.position.x + ',' + current.direction;
			const alreadyVisited = visited.get(serialized);
			if (alreadyVisited && alreadyVisited < current.score) {
				continue;
			}

			visited.set(serialized, current.score);

			const nextPosition = this.getNextPosition(current.position, current.direction);
			queue.push({
				position: nextPosition,
				direction: current.direction,
				score: current.score + 1,
				visitedTiles: [...current.visitedTiles, nextPosition],
			});
			queue.push(
				...this.getRotations(current.direction).map((direction) => ({
					position: { ...current.position },
					direction,
					score: current.score + 1000,
					visitedTiles: [...current.visitedTiles],
				})),
			);
		}

		const minScore = Math.min(...locations.map((location) => location.score));
		return locations.filter((location) => location.score === minScore);
	}

	solvePart1(input: string[]) {
		return this.solve(input)[0].score;
	}

	solvePart2(input: string[]) {
		const locations = this.solve(input);
		return makeUnique(locations.flatMap((i) => i.visitedTiles)).length;
	}
}
