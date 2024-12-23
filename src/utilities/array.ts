export function groupBy<T>(
	items: T[],
	selector: (item: T) => string | number,
): Record<string, T[]> {
	return items.reduce((agg: Record<string, T[]>, curr) => {
		const s = selector(curr);
		(agg[s] = agg[s] || []).push(curr);
		return agg;
	}, {});
}

export function numberRange(start: number, length: number) {
	return Array.from({ length }, (_, i) => i + start);
}

export function getMaxKey(input: Record<string, unknown>) {
	return Math.max(...Object.keys(input).map((e) => parseInt(e)));
}

export function findMostOftenItem(items: (string | number)[]) {
	const grouped = groupBy(items, (item) => item);
	const groupedByLength = groupBy(
		Object.values(grouped),
		(item) => item.length,
	);
	const maxKey = getMaxKey(groupedByLength);

	return {
		item: groupedByLength[maxKey][0][0],
		occurrences: maxKey,
	};
}

export function areAllItemsSame<T>(items: T[]) {
	return Array.from(new Set(items)).length === 1;
}

export function sum(items: number[]) {
	return items.reduce((agg, curr) => agg + curr, 0);
}

export function addBorder<T>(
	array: T[][],
	borderValue: T,
	borderWidth = 1,
): T[][] {
	const result: T[][] = [];
	for (let y = 0; y < array.length + borderWidth * 2; y++) {
		const line: T[] = [];

		for (let x = 0; x < array[0].length + borderWidth * 2; x++) {
			if (
				y < borderWidth || y >= array.length + borderWidth ||
				x < borderWidth || x >= array[0].length + borderWidth
			) {
				line.push(borderValue);
			} else {
				line.push(array[y - borderWidth][x - borderWidth]);
			}
		}
		result.push(line);
	}

	return result;
}

export function removeBorder<T>(array: T[][], borderWidth = 1): T[][] {
	const result: T[][] = [];
	for (let y = 0; y < array.length - borderWidth * 2; y++) {
		const line: T[] = [];

		for (let x = 0; x < array[0].length - borderWidth * 2; x++) {
			line.push(array[y + borderWidth][x + borderWidth]);
		}
		result.push(line);
	}

	return result;
}

export function makePairs<T>(array: T[]): [T, T][] {
	return array.flatMap(
		(v) => array.filter((q) => q !== v).map((w) => [v, w]) as [T, T][],
	);
}

export function makeGrid<T>(height: number, width: number, fill?: T): T[][] {
	return new Array(height).fill(0).map(() => new Array(width).fill(fill ?? 0));
}

export function partitionBy<T>(
	array: T[],
	predicate: (item: T, index: number) => boolean,
): [T[], T[]] {
	const partitionOne: T[] = [];
	const partitionTwo: T[] = [];

	array.forEach((item, index) => {
		if (predicate(item, index)) {
			partitionOne.push(item);
		} else {
			partitionTwo.push(item);
		}
	});

	return [partitionOne, partitionTwo];
}

export function print<T>(array: T[][], pad?: number) {
	for (let y = 0; y < array.length; y++) {
		const line: string[] = [];
		for (let x = 0; x < array[y].length; x++) {
			line.push(String(array[y][x]).padStart(pad ?? 0, ' '));
		}

		console.log(line.join(''));
	}
}

export function get4Adjacent(x: number, y: number) {
	return [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];
}

export function get4AdjacentDirections() {
	return [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }];
}

export function cloneGrid<T>(input: T[][]): T[][] {
	return input.map((i) => [...i]);
}

export function isWithinBoundaries(input: unknown[][], x: number, y: number) {
	return y >= 0 && y < input.length && x >= 0 && x < input[0].length;
}

export function makeUnique<T>(input: T[]): T[] {
	return Array.from(new Set(input.map((i) => JSON.stringify(i)))).map((i) => JSON.parse(i));
}
