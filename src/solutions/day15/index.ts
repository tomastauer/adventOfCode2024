import { makeUnique } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

type Point = {
	x: number;
	y: number;
};

type Command = '^' | 'v' | '<' | '>';

export default class Day01 implements Solution {
	getDelta(command: Command) {
		switch (command) {
			case '^':
				return { x: 0, y: -1 };
			case 'v':
				return { x: 0, y: 1 };
			case '<':
				return { x: -1, y: 0 };
			case '>':
				return { x: 1, y: 0 };
		}
	}

	canMove(grid: string[][], point: Point, command: Command): boolean {
		const pointCopy = { ...point };

		while (true) {
			const delta = this.getDelta(command);

			if (grid[pointCopy.y][pointCopy.x] === '.') {
				return true;
			}

			if (grid[pointCopy.y][pointCopy.x] === '#') {
				return false;
			}

			pointCopy.x += delta.x;
			pointCopy.y += delta.y;

			if (command === '^' || command === 'v') {
				if (grid[pointCopy.y][pointCopy.x] === '[') {
					return this.canMove(grid, pointCopy, command) && this.canMove(grid, { x: pointCopy.x + 1, y: pointCopy.y }, command);
				}

				if (grid[pointCopy.y][pointCopy.x] === ']') {
					return this.canMove(grid, pointCopy, command) && this.canMove(grid, { x: pointCopy.x - 1, y: pointCopy.y }, command);
				}
			}
		}
	}

	getPointsToMove(grid: string[][], point: Point, command: Command): Point[] {
		const delta = this.getDelta(command);
		const nextPoint = { x: point.x + delta.x, y: point.y + delta.y };

		if (grid[point.y][point.x] === '.') {
			return [];
		}

		if (command === '^' || command === 'v') {
			if (grid[point.y][point.x] === '[') {
				return [
					{ ...point },
					{ ...point, x: point.x + 1 },
					...this.getPointsToMove(grid, nextPoint, command),
					...this.getPointsToMove(grid, { x: nextPoint.x + 1, y: nextPoint.y }, command),
				];
			}

			if (grid[point.y][point.x] === ']') {
				return [
					{ ...point },
					{ ...point, x: point.x - 1 },
					...this.getPointsToMove(grid, nextPoint, command),
					...this.getPointsToMove(grid, { x: nextPoint.x - 1, y: nextPoint.y }, command),
				];
			}
		}

		return [{ ...point }, ...this.getPointsToMove(grid, nextPoint, command)];
	}

	move(grid: string[][], point: Point, command: Command) {
		const movingQueue: Point[] = makeUnique([point, ...this.getPointsToMove(grid, point, command)]);

		const moves = movingQueue.map((point) => (
			{
				point,
				current: grid[point.y][point.x],
				nextPosition: { x: point.x + this.getDelta(command).x, y: point.y + this.getDelta(command).y },
			}
		));

		moves.forEach(({ point, nextPosition, current }) => {
			grid[point.y][point.x] = moves.find((m) => m.nextPosition.x === point.x && m.nextPosition.y === point.y)?.current ?? '.';
			grid[nextPosition.y][nextPosition.x] = current;
		});
	}

	doubleGrid(grid: string[][]) {
		return grid.map((row) =>
			row.flatMap((c) => {
				if (c === '#') {
					return ['#', '#'];
				}

				if (c === '.') {
					return ['.', '.'];
				}

				if (c === 'O') {
					return ['[', ']'];
				}

				if (c === '@') {
					return ['@', '.'];
				}

				throw new Error();
			})
		);
	}

	solvePart1(input: string[]) {
		const [map, instructions] = input.join('\n').split('\n\n');

		const grid = map.split('\n').map((row) => row.split(''));
		const commands = instructions.split('\n').flatMap((line) => line.split('')) as Command[];
		const robotIndex = grid.flat().indexOf('@');

		const robot = { x: robotIndex % grid[0].length, y: Math.floor(robotIndex / grid[0].length) };

		commands.forEach((command) => {
			if (this.canMove(grid, robot, command)) {
				this.move(grid, robot, command);
			}
		});

		return grid.reduce((acc, curr, row) => acc + curr.map((l, i) => l === 'O' ? i : 0).reduce((a, c) => a + (c === 0 ? 0 : c + (row * 100))), 0);
	}

	solvePart2(input: string[]) {
		const [map, instructions] = input.join('\n').split('\n\n');

		const grid = this.doubleGrid(map.split('\n').map((row) => row.split('')));
		const commands = instructions.split('\n').flatMap((line) => line.split('')) as Command[];
		const robotIndex = grid.flat().indexOf('@');

		const robot = { x: robotIndex % grid[0].length, y: Math.floor(robotIndex / grid[0].length) };

		commands.forEach((command) => {
			if (this.canMove(grid, robot, command)) {
				this.move(grid, robot, command);
				robot.x += this.getDelta(command).x;
				robot.y += this.getDelta(command).y;
			}
		});

		return grid.reduce((acc, curr, row) => acc + curr.map((l, i) => l === '[' ? i : 0).reduce((a, c) => a + (c === 0 ? 0 : c + (row * 100))), 0);
	}
}
