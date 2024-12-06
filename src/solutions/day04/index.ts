import { Solution } from '../../utilities/solver.ts';

const directions = [
	{ x: 0, y: 1 },
	{ x: 1, y: 1 },
	{ x: -1, y: 1 },
	{ x: 0, y: -1 },
	{ x: 1, y: -1 },
	{ x: -1, y: -1 },
	{ x: 1, y: 0 },
	{ x: -1, y: 0 },
];

type Letter = 'X' | 'M' | 'A' | 'S' | 'F';

type Direction = typeof directions[number];

export default class Day01 implements Solution {
	getNextLettter(letter: Letter): Letter {
		switch (letter) {
			case 'X':
				return 'M';
			case 'M':
				return 'A';
			case 'A':
				return 'S';
			case 'S':
			default:
				return 'F';
		}
	}

	check(
		map: Letter[][],
		y: number,
		x: number,
		direction: Direction,
		expectedNext: Letter,
	) {
		const nextX = x + direction.x;
		const nextY = y + direction.y;

		if (
			nextX < 0 || nextY < 0 || nextX >= map[0].length ||
			nextY >= map.length || map[nextY][nextX] !== expectedNext
		) {
			return false;
		}

		const nextLetter = this.getNextLettter(expectedNext);
		if (nextLetter === 'F') {
			return true;
		}

		return this.check(map, nextY, nextX, direction, nextLetter);
	}

	solvePart1(input: string[]) {
		const map = input.map((i) => i.split('') as Letter[]);

		let foundWords = 0;

		for (let r = 0; r < map.length; r++) {
			for (let c = 0; c < map[r].length; c++) {
				if (map[r][c] === 'X') {
					foundWords += directions.map((d) =>
						this.check(map, r, c, d, 'M')
					).filter(Boolean).length;
				}
			}
		}

		return foundWords;
	}

	checkMas(map: Letter[][], y: number, x: number) {
		if (
			y === 0 || x === 0 || y === map.length - 1 ||
			x === map[0].length - 1 || map[y][x] !== 'A'
		) {
			return false;
		}

		const tl = map[y - 1][x - 1];
		const tr = map[y - 1][x + 1];
		const bl = map[y + 1][x - 1];
		const br = map[y + 1][x + 1];

		return ((tl === 'S' && br === 'M') || (tl === 'M' && br === 'S')) &&
			((tr === 'S' && bl === 'M') || (tr === 'M' && bl === 'S'));
	}

	solvePart2(input: string[]) {
		const map = input.map((i) => i.split('') as Letter[]);

		let foundWords = 0;

		for (let r = 0; r < map.length; r++) {
			for (let c = 0; c < map[r].length; c++) {
				foundWords += Number(this.checkMas(map, r, c));
			}
		}

		return foundWords;
	}
}
