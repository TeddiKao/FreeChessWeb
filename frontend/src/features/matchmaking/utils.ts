import { getUsername } from "../../shared/utils/apiUtils";

async function getAssignedColor(whitePlayer: string, blackPlayer: string) {
	const username = await getUsername();

	const isPlayingWhite = username === whitePlayer;
	const assignedColor = isPlayingWhite ? "white" : "black";

	return assignedColor;
}

export { getAssignedColor };
