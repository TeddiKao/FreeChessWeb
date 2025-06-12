import { TimeControl } from "../../../types/gameSetup";
import { displayTimeControl } from "../../../utils/timeUtils";
import LoadingSpinner from "../LoadingSpinner";
import ModalWrapper from "../wrappers/ModalWrapper";

type ChallengeResponseWaitScreenProps = {
    visible: boolean;
    timeControlInfo: TimeControl
}

function ChallengeResponseWaitScreen({ visible, timeControlInfo }: ChallengeResponseWaitScreenProps) {
    return (
        <ModalWrapper visible={visible}>
            <div className="challenge-response-wait-screen-container">
                <h3 className="challenge-response-status">Waiting for response</h3>
                <LoadingSpinner />
                <p className="challenge-time-control">{displayTimeControl(timeControlInfo)}</p>
            </div>
        </ModalWrapper>
    )
}

export default ChallengeResponseWaitScreen;