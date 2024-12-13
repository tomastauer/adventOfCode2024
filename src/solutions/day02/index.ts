import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const reports = input.map((i) => i.split(' ').map((n) => parseInt(n)));
		const increasing = reports.filter((r) => r.every((n, i, a) => (i === a.length - 1) || (a[i + 1] - n > 0 && a[i + 1] - n <= 3)));

		const decreasing = reports.filter((r) => r.every((n, i, a) => (i === a.length - 1) || (n - a[i + 1] > 0 && n - a[i + 1] <= 3)));

		return increasing.length + decreasing.length;
	}

	createCombinations(input: number[]) {
		return input.map((_, i, a) => a.filter((_, j) => j !== i));
	}

	solvePart2(input: string[]) {
		const reports = input.map((i) => i.split(' ').map((n) => parseInt(n)));
		const increasing = reports.filter((r) =>
			this.createCombinations(r).some((c) =>
				c.every((n, i, a) =>
					(i === a.length - 1) ||
					(a[i + 1] - n > 0 && a[i + 1] - n <= 3)
				)
			)
		);

		const decreasing = reports.filter((r) =>
			this.createCombinations(r).some((c) =>
				c.every((n, i, a) =>
					(i === a.length - 1) ||
					(n - a[i + 1] > 0 && n - a[i + 1] <= 3)
				)
			)
		);

		return increasing.length + decreasing.length;
	}
}
