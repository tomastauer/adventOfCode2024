export function getPairs<T>(array: T[]): [T, T][] {
	const pairs: [T, T][] = [];

	for (let i = 0; i < array.length; i++) {
		for (let j = i + 1; j < array.length; j++) {
			pairs.push([array[i], array[j]]);
		}
	}

	return pairs;
}
