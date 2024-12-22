import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	*secret(seed: bigint) {
		while (true) {
			seed = (seed << 6n ^ seed) % 16777216n;
			seed = (seed >> 5n ^ seed) % 16777216n;
			seed = (seed << 11n ^ seed) % 16777216n;

			yield Number(seed);
		}
	}

	getPrices(input: number[]) {
		return input.map((i) => i % 10);
	}

	getDiffs(prices: number[]) {
		return prices.reduce((acc, curr, i, arr) => {
			if (i > 0) {
				acc.push(curr - arr[i - 1]);
			}
			return acc;
		}, [] as number[]);
	}

	getCandidates(prices: number[], diffs: number[]) {
		const candidates: Record<string, number> = {};
		for (let i = 3; i < diffs.length; i++) {
			const price = prices[i + 1];
			const diff = [diffs[i - 3], diffs[i - 2], diffs[i - 1], diffs[i]].join(',');

			if (!candidates[diff] && price > 0) {
				candidates[diff] = price;
			}
		}

		return candidates;
	}

	solvePart1(input: string[]) {
		return input.map((i) => {
			const generator = this.secret(BigInt(parseInt(i)));
			let last = 0;
			for (let i = 0; i < 2000; i++) {
				last = generator.next().value!;
			}

			return last;
		}).reduce((a, b) => a + b, 0);
	}

	solvePart2(input: string[]) {
		const allCandidates = input.map((i) => {
			const generator = this.secret(BigInt(parseInt(i)));
			const secrets = new Array(2000).fill(0).map(() => generator.next().value!);
			secrets.unshift(parseInt(i));

			const prices = this.getPrices(secrets);
			const diffs = this.getDiffs(prices);

			const candidates = this.getCandidates(prices, diffs);
			return candidates;
		});

		const allKeys = new Set(allCandidates.flatMap((c) => Object.keys(c)));

		let max = 0;

		Array.from(allKeys.values()).forEach((k) => {
			const sum = allCandidates.filter((a) => a[k]).flatMap((a) => a[k]).reduce((a, b) => a + b, 0);
			if (sum > max) {
				max = sum;
			}
		});

		return max;
	}
}
