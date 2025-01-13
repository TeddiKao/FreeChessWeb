const bulletTimeControls = [
	{
		baseTime: 60,
		increment: 0,
	},

	{
		baseTime: 60,
		increment: 1,
	},

	{
		baseTime: 120,
		increment: 0,
	},

	{
		baseTime: 120,
		increment: 1,
	}
];

const blitzTimeControls = [
	{
		baseTime: 180,
		increment: 0,
	},

	{
		baseTime: 180,
		increment: 2,
	},

	{
		baseTime: 300,
		increment: 0,
	},
];

const rapidTimeControls = [
	{
		baseTime: 600,
		increment: 0,
	},

	{
		baseTime: 600,
		increment: 2,
	},

	{
		baseTime: 600,
		increment: 5,
	},

	{
		baseTime: 900,
		increment: 10,
	},
];

const classicalTimeControls = [
	{
		baseTime: 90 * 60,
		increment: 30,
	}
];

export { bulletTimeControls, blitzTimeControls, rapidTimeControls, classicalTimeControls }