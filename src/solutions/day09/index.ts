import { Solution } from '../../utilities/solver.ts';

type File = {
	id: number | 'hole';
	start: number;
	end: number;
	space: number;
};

export default class Day01 implements Solution {
	parse(input: string[]) {
		let start = 0;
		return input[0].split('').reduce((acc, curr, i) => {
			const currInt = parseInt(curr);

			if (currInt === 0) {
				return acc;
			}

			acc.push({
				id: i % 2 === 0 ? i / 2 : 'hole',
				start,
				end: start + currInt - 1,
				space: currInt,
			});
			start += currInt;

			return acc;
		}, [] as File[]);
	}

	solvePart1(input: string[]) {
		const parsed = this.parse(input);

		while (true) {
			const leftMostHoleIndex = parsed.findIndex((p) => p.id === 'hole');
			if (leftMostHoleIndex === -1) {
				break;
			}

			const leftMostHole = parsed[leftMostHoleIndex];
			const { end, start, id } = parsed.pop()!;
			if (id === 'hole') {
				continue;
			}

			const compressLength = end - start + 1;
			const holeLenght = leftMostHole.end - leftMostHole.start + 1;
			if (compressLength < holeLenght) {
				parsed.splice(leftMostHoleIndex, 0, {
					id,
					start: leftMostHole.start,
					end: leftMostHole.start + compressLength - 1,
					space: 0,
				});
				leftMostHole.start += compressLength;
			} else if (compressLength >= holeLenght) {
				leftMostHole.id = id;

				if (compressLength > holeLenght) {
					parsed.push({ id, start, end: end - holeLenght, space: 0 });
				}
			}
		}

		return parsed.reduce((acc, curr) => {
			for (let i = curr.start; i <= curr.end; i++) {
				acc += i * (curr.id as number);
			}
			return acc;
		}, 0);
	}

	solvePart2(input: string[]) {
		const parsed = this.parse(input);

		let fileId = parsed.at(-1)!.id as number;

		while (true) {
			if (fileId < 0) {
				break;
			}

			const fileToCompressIndex = parsed.findIndex((p) => p.id === fileId)!;

			fileId--;

			const fileToCompress = parsed[fileToCompressIndex];
			const emptySpaceIndex = parsed.findIndex((p, i) =>
				p.id === 'hole' && p.space >= fileToCompress.space &&
				i < fileToCompressIndex
			);

			if (emptySpaceIndex === -1) {
				continue;
			}

			const emptySpace = parsed[emptySpaceIndex];

			if (emptySpace.space === fileToCompress.space) {
				emptySpace.id = fileToCompress.id;
				fileToCompress.id = 'hole';
			} else {
				parsed.splice(emptySpaceIndex, 0, {
					...fileToCompress,
					start: emptySpace.start,
					end: emptySpace.start + fileToCompress.space - 1,
				});

				fileToCompress.id = 'hole';

				emptySpace.start += fileToCompress.space;
				emptySpace.space -= fileToCompress.space;
			}
		}

		return parsed.filter((p) => p.id !== 'hole').reduce((acc, curr) => {
			for (let i = curr.start; i <= curr.end; i++) {
				acc += i * (curr.id as number);
			}
			return acc;
		}, 0);
	}
}
