import { TimeControl } from "../../../types/gameSetup";
import { displayTimeControl } from "../../../utils/timeUtils";
import LoadingSpinner from "../LoadingSpinner";
import ModalWrapper from "../wrappers/ModalWrapper";

import "../../../styles/modals/matchmaking-shortcut-screen.scss";

type MatchmakingShortcutScreenProps = {
    visible: boolean,
    timeControlInfo: TimeControl
}

function MatchmakingShortcutScreen({ visible, timeControlInfo }: MatchmakingShortcutScreenProps) {
    return (
        <ModalWrapper visible={visible}>
            <div className="matchmaking-shortcut-screen-container">
                <h3 className="matchmaking-status">Finding match</h3>
                <LoadingSpinner />
                <p className="time-control-info">{displayTimeControl(timeControlInfo)}</p>
            </div>
        </ModalWrapper>
    )
}

export default MatchmakingShortcutScreen;