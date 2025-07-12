import { TimeControl } from "@sharedTypes/time.types";
import { displayTimeControl } from "@sharedUtils/timeUtils";
import LoadingSpinner from "@sharedComponents/LoadingSpinner";
import BaseModal from "@sharedComponents/layout/BaseModal";

import "@challenge/styles/challenge-response-wait-screen.scss";

type ChallengeResponseWaitScreenProps = {
	visible: boolean;
	timeControlInfo: TimeControl | null;
};

function ChallengeResponseWaitScreen({
	visible,
	timeControlInfo,
}: ChallengeResponseWaitScreenProps) {
	return (
		<BaseModal visible={visible}>
			<div className="challenge-response-wait-screen-container">
				<h3 className="challenge-response-status">
					Waiting for response
				</h3>
				<LoadingSpinner />

				{timeControlInfo && (
					<p className="wait-screen-challenge-time-control">
						{displayTimeControl(timeControlInfo)}
					</p>
				)}
			</div>
		</BaseModal>
	);
}

export default ChallengeResponseWaitScreen;
