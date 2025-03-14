import { useState, useEffect } from "react";

import "../../styles/features/gameplay/gameplay-action-buttons.scss";
import ConfirmationPopup from "../popups/ConfirmationPopup";
import { RefObject } from "../../types/general";
import { WebSocketEventTypes } from "../../enums/gameLogic";

type GameplayActionButtonsProps = {
    gameWebsocket: RefObject<WebSocket | null>;
};

function GameplayActionButtons({ gameWebsocket }: GameplayActionButtonsProps) {
    if (!gameWebsocket) {
        return null;
    }
    
    const [resignationPopupVisible, setResignationPopupVisible] =
        useState(false);

    useEffect(() => {
        if (gameWebsocket.current) {
            gameWebsocket.current.onmessage = (event: MessageEvent) => {
                handleOnMessage(event);
            };
        }
    }, []);

    function handleResignationPopupDisplay() {
        setResignationPopupVisible(true);
    }

    function handleResignationConfirmation() {
        const resignationDetails = {
            type: "resign_request"
        }

        gameWebsocket.current?.send(JSON.stringify(resignationDetails));
    }

    function handleOnMessage(event: MessageEvent) {
        const parsedEventData = JSON.parse(event.data);
        const eventType = parsedEventData["type"];

        switch (eventType) {
            case WebSocketEventTypes.PLAYER_RESIGNED:
                handleResignation(parsedEventData);
                break;
        }
    }

    function handleResignation(eventData: any) {
        console.log(`Player ${eventData["resigning_color"]} resigned!`);
    }

    return (
        <div className="gameplay-action-buttons-container">
            <h4 className="gameplay-action-buttons-header">Gameplay actions</h4>
            <div className="gameplay-action-buttons">
                <div
                    onClick={handleResignationPopupDisplay}
                    className="resignation-icon"
                >
                    <img className="resign-icon" src="/resignButton.svg" />
                    <p className="helper-text">Resign</p>

                    <ConfirmationPopup
                        isOpen={resignationPopupVisible}
                        setIsOpen={setResignationPopupVisible}
                        confirmationMessage="Are you sure you want to resign?"
                        confirmAction={handleResignationConfirmation}
                    />
                </div>
            </div>
        </div>
    );
}

export default GameplayActionButtons;
