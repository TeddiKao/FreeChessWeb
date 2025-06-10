import { TimeControl } from "../../../types/gameSetup";
import { displayTimeControl } from "../../../utils/timeUtils";
import ModalWrapper from "../wrappers/ModalWrapper";

import "../../../styles/modals/challenge-notification.scss";

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
			<div className="challenge-notification-modal-container">
				<h2 className="challenge-notifcation-modal-title">
					Challenge received
				</h2>
				<div className="challenger-info-container">
					<img className="challenger-profile-picture" />
					<div className="main-challenge-info">
						<p className="challenger-relationship">
							{challengerRelationship}
						</p>

						<p className="challenger-username">
							{challengerUsername}
						</p>

                        <p className="challenge-time-control">
                            {displayTimeControl(timeControl)}
                        </p>
					</div>
				</div>

                <div className="challenge-handling-buttons-container">
                    <button className="decline-challenge-button">Decline</button>
                    <button className="accept-challenge-button">Accept</button>
                </div>
			</div>
		</ModalWrapper>
	);
}

export default ChallengeNotification;
