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
	directionalMapping: Record<string, Record<string, string>> = {
		'A': { '>': 'vA', '<': 'v<<A', '^': '<A', 'v': 'v<A', 'A': 'A' },
		'>': { '>': 'A', '<': '<<A', '^': '^<A', 'v': '<A', 'A': '^A' },
		'<': { '>': '>>A', '<': 'A', '^': '>^A', 'v': '>A', 'A': '>>^A' },
		'v': { '>': '>A', '<': '<A', '^': '^A', 'v': 'A', 'A': '>^A' },
		'^': { '>': '>vA', '<': 'v<A', '^': 'A', 'v': 'vA', 'A': '>A' },
	};

	keypadMapping: Record<string, Record<string, string>> = {
		'9': { '9': 'A', '8': '<A', '7': '<<A', 6: 'vA', 5: 'v<A', 4: 'v<<A', 3: 'vvA', 2: 'vv<A', 1: 'vv<<A', 0: 'vvv<A', 'A': 'vvvA' },
		'8': { '9': '>A', '8': 'A', '7': '<A', 6: '>vA', 5: 'vA', 4: 'v<A', 3: '>vvA', 2: 'vvA', 1: 'vv<A', 0: 'vvvA', 'A': 'vvv>A' },
		'7': { '9': '>>A', '8': '>A', '7': 'A', 6: '>>vA', 5: '>vA', 4: 'vA', 3: '>>vvA', 2: '>vvA', 1: 'vvA', 0: '>vvvA', 'A': '>>vvvA' },
		'6': { '9': '^A', '8': '<^A', '7': '<<^A', 6: 'A', 5: '<A', 4: '<<A', 3: 'vA', 2: 'v<A', 1: 'v<<A', 0: 'vv<A', 'A': 'vvA' },
		'5': { '9': '^>A', '8': '^A', '7': '<^A', 6: '>A', 5: 'A', 4: '<A', 3: '>vA', 2: 'vA', 1: 'v<A', 0: 'vvA', 'A': 'vv>A' },
		'4': { '9': '^>>A', '8': '^>A', '7': '^A', 6: '>>A', 5: '>A', 4: 'A', 3: '>>vA', 2: '>vA', 1: 'vA', 0: '>vvA', 'A': '>>vvA' },
		'3': { '9': '^^A', '8': '^^<A', '7': '<<^^A', 6: '^A', 5: '^<A', 4: '^<<A', 3: 'A', 2: '<A', 1: '<<A', 0: 'v<A', 'A': 'vA' },
		'2': { '9': '^^>A', '8': '^^A', '7': '<^^A', 6: '^>A', 5: '^A', 4: '^<A', 3: '>A', 2: 'A', 1: '<A', 0: 'vA', 'A': 'v>A' },
		'1': { '9': '^^>>A', '8': '^^>A', '7': '^^A', 6: '^>>A', 5: '^>A', 4: '^A', 3: '>>A', 2: '>A', 1: 'A', 0: '>vA', 'A': '>>vA' },
		'0': { '9': '^^^>A', '8': '^^^A', '7': '^^^<A', 6: '^^>A', 5: '^^A', 4: '^^<A', 3: '^>A', 2: '^A', 1: '^<A', 0: 'A', 'A': '>A' },
		'A': { '9': '^^^A', '8': '<^^^A', '7': '^^^<<A', 6: '^^A', 5: '^^<A', 4: '^^<<A', 3: '^A', 2: '^<A', 1: '^<<A', 0: '<A', 'A': 'A' },
	};

	runKeypad(code: string) {
		let current = 'A';
		const result: string[] = [];

		for (const c of code) {
			result.push(this.keypadMapping[current][c]);
			current = c;
		}

		return result.join('');
	}

	runDirectional(code: string) {
		let current = 'A';
		const result: string[] = [];

		for (const c of code) {
			result.push(this.directionalMapping[current][c]);
			current = c;
		}

		return result.join('');
	}

	solvePart1(input: string[]) {
		const numberOfDirectional = 2;

		return input.map((i) => {
			const keypadMapping = this.runKeypad(i);
			let result = keypadMapping;
			console.log(i);
			for (let j = 0; j < numberOfDirectional; j++) {
				console.log(result);
				result = this.runDirectional(result);
			}
			console.log(result);
			return result.length * parseInt(i);
		}).reduce((acc, curr) => acc + curr, 0);
	}

	solvePart2(input: string[]) {
		return 0;
		const numberOfDirectional = 25;
		const directionalCache: Record<string, number> = {};

		['>', '<', '^', 'v'].forEach((c) => {
			let current = c;
			for (let j = 0; j < 10; j++) {
				current = this.runDirectional(current);
			}

			directionalCache[c] = current.length;
		});

		console.log(directionalCache);

		let current = '>';
		for (let i = 0; i < 25; i++) {
			current = this.runDirectional(current);
			console.log(i, current.length);
		}

		return input.map((i) => {
			const keypadMapping = this.runKeypad(i);
			let result = keypadMapping;

			for (let j = 0; j < numberOfDirectional; j++) {
				result = this.runDirectional(result);
			}

			return result.length * parseInt(i);
		}).reduce((acc, curr) => acc + curr, 0);
	}
}
