import { useState } from "react";

import "../../styles/features/gameplay/gameplay-action-buttons.scss";
import ConfirmationPopup from "../popups/ConfirmationPopup";
import { RefObject } from "../../types/general";

type GameplayActionButtonsProps = {
    gameWebsocket: RefObject<WebSocket | null>;
}

function GameplayActionButtons({ gameWebsocket }: GameplayActionButtonsProps) {
    const [confirmationPopupVisible, setConfirmationPopupVisible] =
        useState(false);

    function handleResignationPopupDisplay() {
        setConfirmationPopupVisible(true);
    }

    function handleResignationConfirmation() {
        const resignationDetails = {
            type: "resign_request"
        }

        gameWebsocket.current?.send(JSON.stringify(resignationDetails));
    }

    return (
        <div className="gameplay-action-buttons-container">
            <h4 className="gameplay-action-buttons-header">Gameplay actions</h4>
            <div className="gameplay-action-buttons">
                <div onClick={handleResignationPopupDisplay} className="resignation-icon">
                    <img className="resign-icon" src="/resignButton.svg" />
                    <p className="helper-text">Resign</p>

                    <ConfirmationPopup
                        isOpen={confirmationPopupVisible}
                        setIsOpen={setConfirmationPopupVisible}
                        confirmationMessage="Are you sure you want to resign?"
                        confirmAction={handleResignationConfirmation}
                    />
                </div>
            </div>
        </div>
    );
}

export default GameplayActionButtons;
