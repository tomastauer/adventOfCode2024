import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	getPages(
		input: string[],
		valid: boolean,
	): [Map<number, number[]>, number[][]] {
		const [rules, pages] = input.join('\n').split('\n\n');

		const ruleMap = new Map<number, number[]>();

		rules.split('\n').map((rule) => {
			const [a, b] = rule.split('|').map((q) => parseInt(q));

			ruleMap.set(a, [...ruleMap.get(a) ?? [], b]);
		});

		const result = pages.split('\n').map((p) =>
			p.split(',').map((q) => parseInt(q))
		).filter((page) => {
			const before: number[] = [];
			let isValid = true;

			page.forEach((p) => {
				const rule = ruleMap.get(p);
				if (rule && before.some((b) => rule.includes(b))) {
					isValid = false;
					return;
				}
				before.push(p);
			});

			return isValid === valid;
		});

		return [ruleMap, result];
	}

	solvePart1(input: string[]) {
		const [_, result] = this.getPages(input, true);

		return result.reduce(
			(acc, curr) => acc + curr[Math.trunc(curr.length / 2)],
			0,
		);
	}

	solvePart2(input: string[]) {
		const [ruleMap, invalidPages] = this.getPages(input, false);

		invalidPages.forEach((p) =>
			p.sort((a, b) => {
				const rule = ruleMap.get(a);
				if (rule && rule.includes(b)) {
					return -1;
				}

				return 1;
			})
		);

		return invalidPages.reduce(
			(acc, curr) => acc + curr[Math.trunc(curr.length / 2)],
			0,
		);
	}
}
