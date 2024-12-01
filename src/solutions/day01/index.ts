import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const left: number[] = [];
		const right: number[] = [];

		input.forEach((i) => {
			const groups = (/(?<left>\d+)\s+(?<right>\d+)/gm).exec(i)!.groups;
			left.push(parseInt(groups!.left));
			right.push(parseInt(groups!.right));
		});

		left.sort((a, b) => a - b);
		right.sort((a, b) => a - b);

		return left.reduce(
			(acc, curr, i) => acc + Math.abs(curr - right[i]),
			0,
		);
	}

	solvePart2(input: string[]) {
		const left: number[] = [];
		const right: number[] = [];

		input.forEach((i) => {
			const groups = (/(?<left>\d+)\s+(?<right>\d+)/gm).exec(i)!.groups;
			left.push(parseInt(groups!.left));
			right.push(parseInt(groups!.right));
		});

		const rightMap = right.reduce(
			(acc, curr) => (acc[curr] = (acc[curr] ?? 0) + 1, acc),
			{} as Record<number, number>,
		);

		return left.reduce(
			(acc, curr) => acc + curr * (rightMap[curr] ?? 0),
			0,
		);
	}
}
