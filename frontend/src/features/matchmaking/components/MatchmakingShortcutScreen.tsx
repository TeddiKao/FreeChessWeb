import LoadingSpinner from "@sharedComponents/LoadingSpinner";
import BaseModal from "@sharedComponents/layout/BaseModal";
import { TimeControl } from "@sharedTypes/time.types";
import { displayTimeControl } from "@sharedUtils/timeUtils";
import "../styles/matchmaking-shortcut-screen.scss";

type MatchmakingShortcutScreenProps = {
	visible: boolean;
	timeControlInfo: TimeControl;
};

function MatchmakingShortcutScreen({
	visible,
	timeControlInfo,
}: MatchmakingShortcutScreenProps) {
	return (
		<BaseModal visible={visible}>
			<div className="matchmaking-shortcut-screen-container">
				<h3 className="matchmaking-status">Finding match</h3>
				<LoadingSpinner />
				<p className="time-control-info">
					{displayTimeControl(timeControlInfo)}
				</p>
			</div>
		</BaseModal>
	);
}

export default MatchmakingShortcutScreen;
