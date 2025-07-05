import { TimeControl } from "../../../shared/types/time.types";
import { displayTimeControl } from "../../../shared/utils/timeUtils";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import BaseModal from "../../../shared/components/layout/BaseModal";

import "../styles/challenge-response-wait-screen.scss";

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
