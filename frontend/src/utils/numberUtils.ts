function roundToNearest(
	num: number,
	placeValue: "ten" | "hundred" | "thousand"
) {
	switch (placeValue) {
        case "ten":
            return Math.round(num / 10) * 10;

        case "hundred":
            return Math.round(num / 100) * 100;

        case "thousand":
            return Math.round(num / 1000) * 1000;
    }
}