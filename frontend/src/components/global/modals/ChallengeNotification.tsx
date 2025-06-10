import { TimeControl } from "../../../types/gameSetup";
import ModalWrapper from "../wrappers/ModalWrapper";

type ChallengeNotificationProps = {
	visible: boolean;
	challengerUsername: string;
	challengerRelationship?: "Recent opponent";
	timeControl: TimeControl;
};

function ChallengeNotification({
	visible,
	challengerUsername,
    challengerRelationship,
	timeControl,
}: ChallengeNotificationProps) {
	return (
		<ModalWrapper visible={visible}>
			<div className="challenge-notification-modal-container"></div>
		</ModalWrapper>
	);
}

export default ChallengeNotification;
