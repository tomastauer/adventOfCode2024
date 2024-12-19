import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const [t, p] = input.join('\n').split('\n\n');
		const towels = t.split(',').map((a) => a.trim());
		const patterns = p.split('\n');

		const processed = patterns.map((pattern, i) => {
			const memo = new Set<string>();

			const queue = [pattern];
			while (queue.length) {
				const current = queue.shift()!;
				for (const towel of towels.filter((towel) => current.startsWith(towel))) {
					const r = current.slice(towel.length);
					if (memo.has(r)) {
						continue;
					}
					memo.add(r);
					queue.push(r);

					if (r.length === 0) {
						return true;
					}
				}
			}
			return false;
		});

		return processed.filter(Boolean).length;
	}

	traverse(towels: string[], pattern: string, memo: Map<string, number>) {
		const memoized = memo.get(pattern);
		if (memoized !== undefined) {
			return memoized;
		}

		let result = 0;
		for (const towel of towels.filter((towel) => pattern.startsWith(towel))) {
			const r = pattern.slice(towel.length);

			if (r.length === 0) {
				result++;
			}

			result += this.traverse(towels, r, memo);
		}

		memo.set(pattern, result);

		return result;
	}

	solvePart2(input: string[]) {
		const [t, p] = input.join('\n').split('\n\n');
		const towels = t.split(',').map((a) => a.trim());
		const patterns = p.split('\n');

		return patterns.map((pattern) => this.traverse(towels, pattern, new Map<string, number>())).reduce((a, b) => a + b, 0);
	}
}
