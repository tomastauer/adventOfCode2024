import { Solution } from '../../utilities/solver.ts';

type Node = {
	children: Node[];
	cache: Map<number, number>;
	value: number;
};

export default class Day01 implements Solution {
	iterate(input: number) {
		if (input === 0) {
			return [1];
		}

		if (`${input}`.length % 2 === 0) {
			const s = `${input}`;
			return [
				parseInt(s.substring(0, s.length / 2)),
				parseInt(s.substring(s.length / 2)),
			];
		}

		return [input * 2024];
	}

	optimize(nodes: Map<number, Node>, maxDepth: number) {
		let optimized = true;

		do {
			optimized = true;
			for (const node of nodes.values()) {
				if (!node.children.length) {
					continue;
				}

				if (!node.cache.has(1)) {
					node.cache.set(1, node.children.length);
					optimized = false;
				}

				for (const key of node.children[0].cache.keys()) {
					if (key > maxDepth) {
						continue;
					}

					if (node.cache.has(key + 1)) {
						continue;
					}

					if (
						node.children.length === 2 &&
						!node.children[1].cache.has(key)
					) {
						continue;
					}

					node.cache.set(
						key + 1,
						node.children.map((n) => n.cache.get(key)!).reduce((
							a,
							c,
						) => a + c),
					);
					optimized = false;
				}
			}
		} while (!optimized);
	}

	solvePart1(input: string[]) {
		let nodes: Map<number, Node>;

		const parsed = input[0].split(' ').map((i) => parseInt(i));
		const totalBlinks = 25;

		let result = 0;

		parsed.forEach((value) => {
			nodes = new Map<number, Node>();
			const node: Node = {
				children: [],
				value,
				cache: new Map<number, number>(),
			};
			nodes.set(value, node);

			let nodesToIterate = [node];

			for (let blink = 1; blink <= totalBlinks; blink++) {
				const nextBatch: Node[] = [];

				nodesToIterate.forEach((n) => {
					this.iterate(n.value).forEach((v) => {
						const existingNode = nodes.get(v);
						if (existingNode) {
							n.children.push(existingNode);
							return;
						}

						const newNode: Node = {
							children: [],
							value: v,
							cache: new Map<number, number>(),
						};
						n.children.push(newNode);
						nodes.set(v, newNode);
						nextBatch.push(newNode);
					});
				});

				nodesToIterate = nextBatch;
				this.optimize(nodes, blink);
			}

			result += nodes.get(value)!.cache.get(totalBlinks)!;
		});

		return result;
	}

	solvePart2(input: string[]) {
		let nodes: Map<number, Node>;

		const parsed = input[0].split(' ').map((i) => parseInt(i));
		const totalBlinks = 75;

		let result = 0;

		parsed.forEach((value) => {
			nodes = new Map<number, Node>();
			const node: Node = {
				children: [],
				value,
				cache: new Map<number, number>(),
			};
			nodes.set(value, node);

			let nodesToIterate = [node];

			for (let blink = 1; blink <= totalBlinks; blink++) {
				const nextBatch: Node[] = [];
				console.log(value, blink);
				nodesToIterate.forEach((n) => {
					this.iterate(n.value).forEach((v) => {
						const existingNode = nodes.get(v);
						if (existingNode) {
							n.children.push(existingNode);
							return;
						}

						const newNode: Node = {
							children: [],
							value: v,
							cache: new Map<number, number>(),
						};
						n.children.push(newNode);
						nodes.set(v, newNode);
						nextBatch.push(newNode);
					});
				});

				nodesToIterate = nextBatch;
				this.optimize(nodes, blink);
			}

			result += nodes.get(value)!.cache.get(totalBlinks)!;
		});

		return result;
	}
}
