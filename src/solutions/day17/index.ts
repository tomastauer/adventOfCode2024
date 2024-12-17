import { Solution } from '../../utilities/solver.ts';

type Program = {
	a: number;
	b: number;
	c: number;
	instructions: number[];
	currentInstruction: number;
};

export default class Day01 implements Solution {
	parse(input: string[]) {
		const [registers, program] = input.join('\n').split('\n\n');
		const [a, b, c] = registers.split('\n').map((line) => parseInt(line.split(':')[1].trim()));
		const p = program.split(':')[1].trim().split(',').map((y) => parseInt(y));

		return {
			a,
			b,
			c,
			instructions: p,
			currentInstruction: 0,
		};
	}

	combo(input: Program, index: number) {
		const v = input.instructions[index];
		if (v >= 0 && v <= 3) {
			return v;
		}

		const map = {
			4: input.a,
			5: input.b,
			6: input.c,
		};

		return map[v as keyof typeof map];
	}

	adv(input: Program) {
		const op = Math.pow(2, this.combo(input, input.currentInstruction + 1));
		input.a = Math.trunc(input.a / op);

		input.currentInstruction += 2;
	}

	bxl(input: Program) {
		input.b = Number(BigInt(input.b) ^ BigInt(input.instructions[input.currentInstruction + 1]));

		input.currentInstruction += 2;
	}

	bsl(input: Program) {
		const op = this.combo(input, input.currentInstruction + 1);
		input.b = op % 8;

		input.currentInstruction += 2;
	}

	jnz(input: Program) {
		if (input.a === 0) {
			input.currentInstruction += 2;
		} else {
			input.currentInstruction = input.instructions[input.currentInstruction + 1];
		}
	}

	bxc(input: Program) {
		input.b = Number(BigInt(input.b) ^ BigInt(input.c));

		input.currentInstruction += 2;
	}

	out(input: Program) {
		const op = this.combo(input, input.currentInstruction + 1);

		input.currentInstruction += 2;
		return op % 8;
	}

	bdv(input: Program) {
		const op = Math.pow(2, this.combo(input, input.currentInstruction + 1));
		input.b = Math.trunc(input.a / op);

		input.currentInstruction += 2;
	}

	cdv(input: Program) {
		const op = Math.pow(2, this.combo(input, input.currentInstruction + 1));
		input.c = Math.trunc(input.a / op);

		input.currentInstruction += 2;
	}

	run(input: Program) {
		const instructionsMap = {
			0: this.adv,
			1: this.bxl,
			2: this.bsl,
			3: this.jnz,
			4: this.bxc,
			5: this.out,
			6: this.bdv,
			7: this.cdv,
		};

		const result: number[] = [];

		while (input.currentInstruction < input.instructions.length) {
			const output = instructionsMap[input.instructions[input.currentInstruction] as keyof typeof instructionsMap].bind(this)(input);

			if (output !== undefined) {
				result.push(output);
			}
		}

		return result;
	}

	solvePart1(input: string[]) {
		const program = this.parse(input);

		return this.run(program)!.join(',');
	}

	solvePart2(input: string[]) {
		const program = this.parse(input);

		const expected = program.instructions.toReversed();

		let result: number[] = [0];

		for (let i = 0; i < 16; i++) {
			const q: number[] = [];

			for (let j = 0; j < 8; j++) {
				result.forEach((r) => {
					const a = parseInt(`${r.toString(8)}${j}`, 8);
					const programCopy: Program = { ...program, instructions: [...program.instructions], a };

					const output = this.run(programCopy);

					if (output[0] === expected[i]) {
						q.push(a);
					}
				});
			}

			result = q;
		}

		return result[0];
	}
}
