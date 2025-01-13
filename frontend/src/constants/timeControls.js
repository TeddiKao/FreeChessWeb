const bulletTimeControls = [
	{
		id: 1,
		baseTime: 60,
		increment: 0,
	},

	{
		id: 2,
		baseTime: 60,
		increment: 1,
	},

	{
		id: 3,
		baseTime: 120,
		increment: 0,
	},

	{
		id: 4,
		baseTime: 120,
		increment: 1,
	}
];

const blitzTimeControls = [
	{
		id: 5,
		baseTime: 180,
		increment: 0,
	},

	{
		id: 6,
		baseTime: 180,
		increment: 2,
	},

	{
		id: 7,
		baseTime: 300,
		increment: 0,
	},
];

const rapidTimeControls = [
	{
		id: 8,
		baseTime: 600,
		increment: 0,
	},

	{
		id: 9,
		baseTime: 600,
		increment: 2,
	},

	{
		id: 10,
		baseTime: 600,
		increment: 5,
	},

	{
		id: 11,
		baseTime: 900,
		increment: 10,
	},
];

const classicalTimeControls = [
	{
		id: 12,
		baseTime: 90 * 60,
		increment: 30,
	}
];

export { bulletTimeControls, blitzTimeControls, rapidTimeControls, classicalTimeControls }