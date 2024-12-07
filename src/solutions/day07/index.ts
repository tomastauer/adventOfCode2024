import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solve(
		result: number,
		numbers: number[],
		allowConcatenation: boolean,
	): boolean {
		let r = result;

		while (numbers.length) {
			const n = numbers.pop()!;
			if (
				r % n === 0 &&
				this.solve(r / n, [...numbers], allowConcatenation)
			) {
				return true;
			}

			const rString = r.toString();
			const nString = n.toString();
			if (
				allowConcatenation && rString.endsWith(nString) && this.solve(
					parseInt(
						rString.substring(
							0,
							rString.length - nString.length,
						),
					),
					[...numbers],
					allowConcatenation,
				)
			) {
				return true;
			}

			r = r - n;

			if (r < 0 || r === 0 && numbers.length) {
				return false;
			}
		}

		return r === 0;
	}

	solvePart1(input: string[]) {
		const parsed = input.map((i) => {
			const [result, rest] = i.split(':');
			return {
				result: parseInt(result),
				numbers: rest.split(' ').filter(Boolean).map((r) =>
					parseInt(r)
				),
			};
		});

		return parsed.filter((p) => this.solve(p.result, [...p.numbers], false))
			.reduce((acc, p) => acc + p.result, 0);
	}

	solvePart2(input: string[]) {
		const parsed = input.map((i) => {
			const [result, rest] = i.split(':');
			return {
				result: parseInt(result),
				numbers: rest.split(' ').filter(Boolean).map((r) =>
					parseInt(r)
				),
			};
		});

		return parsed.filter((p) => this.solve(p.result, [...p.numbers], true))
			.reduce((acc, p) => acc + p.result, 0);
	}
}
