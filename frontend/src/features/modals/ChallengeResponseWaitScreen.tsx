import { TimeControl } from "../../types/gameSetup";
import { displayTimeControl } from "../../utils/timeUtils";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ModalWrapper from "../../components/wrappers/ModalWrapper";

import "../../../styles/modals/challenge-response-wait-screen.scss";

type ChallengeResponseWaitScreenProps = {
	visible: boolean;
	timeControlInfo: TimeControl | null;
};

function ChallengeResponseWaitScreen({
	visible,
	timeControlInfo,
}: ChallengeResponseWaitScreenProps) {
	return (
		<ModalWrapper visible={visible}>
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
		</ModalWrapper>
	);
}

export default ChallengeResponseWaitScreen;
