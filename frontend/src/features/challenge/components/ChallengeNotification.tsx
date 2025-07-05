import { TimeControl } from "../../../shared/types/time.types";
import { displayTimeControl } from "../../../utils/timeUtils";
import BaseModal from "../../../shared/components/layout/BaseModal";

import "../styles/challenge-notification.scss";
import { useContext } from "react";
import { ChallengeWebsocketContext } from "../../../app/providers/ChallengeWebsocketProvider";

type ChallengeNotificationProps = {
	visible: boolean;
	challengerUsername: string;
	challengerRelationship?: "Recent opponent" | "Unknown";
	timeControl: TimeControl | null;
};

function ChallengeNotification({
	visible,
	challengerUsername,
	challengerRelationship,
	timeControl,
}: ChallengeNotificationProps) {
	const { acceptChallenge, declineChallenge } = useContext(
		ChallengeWebsocketContext
	)!;

	if (!visible) {
		return null;
	}

	function handleAcceptClick() {
		acceptChallenge(challengerUsername);
	}

	function handleDeclineClick() {
		declineChallenge(challengerUsername);
	}

	return (
		<BaseModal visible={visible}>
			<div className="challenge-notification-modal-container">
				<h2 className="challenge-notification-modal-title">
					Challenge received
				</h2>
				<div className="challenger-info-container">
					<img className="challenger-profile-picture" />
					<div className="main-challenge-info">
						{challengerRelationship && (
							<p className="challenger-relationship">
								{challengerRelationship}
							</p>
						)}

						<p className="challenger-username">
							{challengerUsername}
						</p>

						<p className="challenge-time-control">
							{displayTimeControl(timeControl!)}
						</p>
					</div>
				</div>

				<div className="challenge-handling-buttons-container">
					<button
						onClick={handleDeclineClick}
						className="decline-challenge-button"
					>
						Decline
					</button>
					<button
						onClick={handleAcceptClick}
						className="accept-challenge-button"
					>
						Accept
					</button>
				</div>
			</div>
		</BaseModal>
	);
}

export default ChallengeNotification;
