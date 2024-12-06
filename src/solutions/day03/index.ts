import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		return input.reduce((acc, curr) =>
			acc + Array.from(
				curr.matchAll(/mul\((?<a>\d{1,3}),(?<b>\d{1,3})\)/gm),
			).reduce(
				(acc, { groups }) =>
					acc + parseInt(groups!['a']) * parseInt(groups!['b']),
				0,
			), 0);
	}

	solvePart2(input: string[]) {
		let read = true;
		return input.reduce((acc, curr) =>
			acc +
			Array.from(
				curr.matchAll(
					/mul\((?<a>\d{1,3}),(?<b>\d{1,3})\)|(?<do>do\(\))|(?<dont>don't\(\))/gm,
				),
			).reduce((acc, { groups }) => {
				if (groups!.do) {
					read = true;
					return acc;
				} else if (groups?.dont) {
					read = false;
					return acc;
				} else if (read) {
					return acc +
						parseInt(groups!['a']) * parseInt(groups!['b']);
				}
				return acc;
			}, 0), 0);
	}
}
