const generatedHues: number[] = [];

export type ColourCode = {
	hue: number;
	colour: string;
};

type Gap = [number, number];

const findGaps = (): Gap[] => {
	if (generatedHues.length == 0) {
		return [[0, 360]];
	}

	const gaps: Gap[] = [];
	const sortedHues = [...generatedHues];
	sortedHues.sort((a, b) => a - b);

	let start = sortedHues.shift()!;
	const first = start;
	let next = start;
	while (sortedHues.length) {
		next = sortedHues.shift()!;
		gaps.push([start, next]);
		start = next;
	}
	gaps.push([next, first + 360]);
	return gaps;
};

const selectGap = (gaps: Gap[]): Gap => {
	const gapIndex = Math.floor(Math.random() ** 3 * gaps.length);
	return gaps[gapIndex];
};

const selectHueInGap = (gap: Gap): number => {
	return Math.floor(((Math.random() + Math.random()) / 2) * (gap[1] - gap[0]) + gap[0]) % 360;
};

export const getHue = () => {
	// generatedHues.push(Math.floor(Math.random() * 360));
	const gaps = findGaps();
	const sortedGaps = gaps.sort((a, b) => b[1] - b[0] - (a[1] - a[0]));
	const gap = selectGap(sortedGaps);
	const hue = selectHueInGap(gap);
	generatedHues.push(hue);
	return hue;
};

export const createHsl = (hue: number) => `hsl(${hue % 360}, 80%, 60%)`;

export function releaseHue(hue: number) {
	const hueIndex = generatedHues.indexOf(hue);
	if (hueIndex != -1) generatedHues.splice(hueIndex, 1);
}
