import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	cache: Record<string, Record<number, number>> = {};

	directionalMapping: Record<string, Record<string, string>> = {
		'A': { '>': 'vA', '<': 'v<<A', '^': '<A', 'v': '<vA', 'A': 'A' },
		'>': { '>': 'A', '<': '<<A', '^': '<^A', 'v': '<A', 'A': '^A' },
		'<': { '>': '>>A', '<': 'A', '^': '>^A', 'v': '>A', 'A': '>>^A' },
		'v': { '>': '>A', '<': '<A', '^': '^A', 'v': 'A', 'A': '^>A' },
		'^': { '>': 'v>A', '<': 'v<A', '^': 'A', 'v': 'vA', 'A': '>A' },
	};

	keypadMapping: Record<string, Record<string, string>> = {
		'9': { '9': 'A', '8': '<A', '7': '<<A', 6: 'vA', 5: '<vA', 4: '<<vA', 3: 'vvA', 2: '<vvA', 1: '<<vvA', 0: '<vvvA', 'A': 'vvvA' },
		'8': { '9': '>A', '8': 'A', '7': '<A', 6: 'v>A', 5: 'vA', 4: '<vA', 3: 'vv>A', 2: 'vvA', 1: '<vvA', 0: 'vvvA', 'A': 'vvv>A' },
		'7': { '9': '>>A', '8': '>A', '7': 'A', 6: 'v>>A', 5: 'v>A', 4: 'vA', 3: 'vv>>A', 2: 'vv>A', 1: 'vvA', 0: '>vvvA', 'A': '>>vvvA' },
		'6': { '9': '^A', '8': '<^A', '7': '<<^A', 6: 'A', 5: '<A', 4: '<<A', 3: 'vA', 2: '<vA', 1: '<<vA', 0: '<vvA', 'A': 'vvA' },
		'5': { '9': '^>A', '8': '^A', '7': '<^A', 6: '>A', 5: 'A', 4: '<A', 3: 'v>A', 2: 'vA', 1: '<vA', 0: 'vvA', 'A': 'vv>A' },
		'4': { '9': '^>>A', '8': '^>A', '7': '^A', 6: '>>A', 5: '>A', 4: 'A', 3: 'v>>A', 2: 'v>A', 1: 'vA', 0: '>vvA', 'A': '>>vvA' },
		'3': { '9': '^^A', '8': '<^^A', '7': '<<^^A', 6: '^A', 5: '<^A', 4: '<<^A', 3: 'A', 2: '<A', 1: '<<A', 0: '<vA', 'A': 'vA' },
		'2': { '9': '^^>A', '8': '^^A', '7': '<^^A', 6: '^>A', 5: '^A', 4: '<^A', 3: '>A', 2: 'A', 1: '<A', 0: 'vA', 'A': 'v>A' },
		'1': { '9': '^^>>A', '8': '^^>A', '7': '^^A', 6: '^>>A', 5: '^>A', 4: '^A', 3: '>>A', 2: '>A', 1: 'A', 0: '>vA', 'A': '>>vA' },
		'0': { '9': '^^^>A', '8': '^^^A', '7': '^^^<A', 6: '^^>A', 5: '^^A', 4: '^^<A', 3: '^>A', 2: '^A', 1: '<^A', 0: 'A', 'A': '>A' },
		'A': { '9': '^^^A', '8': '<^^^A', '7': '^^^<<A', 6: '^^A', 5: '<^^A', 4: '^^<<A', 3: '^A', 2: '<^A', 1: '^<<A', 0: '<A', 'A': 'A' },
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
			for (let j = 0; j < numberOfDirectional; j++) {
				result = this.runDirectional(result);
			}
			return result.length * parseInt(i);
		}).reduce((acc, curr) => acc + curr, 0);
	}

	getPrice(fragment: string, depth: number): number {
		this.cache[fragment] = this.cache[fragment] ?? {};
		const fragmentCache = this.cache[fragment];
		if (fragmentCache[depth]) {
			return fragmentCache[depth];
		}

		if (fragment === 'A') {
			return 1;
		}

		if (depth === 25) {
			const length = this.runDirectional(fragment).length;
			fragmentCache[depth] = length;

			return length;
		}

		const result = this.runDirectional(fragment).split('A').map((f) => `${f}A`).slice(0, -1).map((f) => {
			const price = this.getPrice(f, depth + 1);

			return price;
		}).reduce((acc, curr) => acc + curr, 0);

		fragmentCache[depth] = result;

		return result;
	}

	solvePart2(input: string[]) {
		return input.map((i) => {
			const keypadMapping = this.runKeypad(i);
			const fragments = keypadMapping.split('A').map((f) => `${f}A`).slice(0, -1);

			fragments.forEach((f) => this.getPrice(f, 1));

			return fragments.map((f) => this.cache[f][1]).reduce((acc, curr) => acc + curr, 0) * parseInt(i);
		}).reduce((acc, curr) => acc + curr, 0);
	}
}
