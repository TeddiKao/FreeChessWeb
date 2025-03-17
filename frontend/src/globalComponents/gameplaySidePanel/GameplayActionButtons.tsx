import { useState, useEffect, useRef } from "react";

import "../../styles/features/gameplay/gameplay-action-buttons.scss";
import ConfirmationPopup from "../popups/ConfirmationPopup";

import { StateSetterFunction } from "../../types/general";

import useWebSocket from "../../hooks/useWebsocket";
import { websocketBaseURL } from "../../constants/urls";
import { getAccessToken } from "../../utils/tokenUtils";
import { WebSocketEventTypes } from "../../enums/gameLogic";

type GameplayActionButtonsProps = {
    gameId: string | number;
    setGameEnded: StateSetterFunction<boolean>,
    setGameEndedCause: StateSetterFunction<string>,
    setGameWinner: StateSetterFunction<string>,
}

function GameplayActionButtons({ gameId, setGameEnded, setGameEndedCause, setGameWinner }: GameplayActionButtonsProps) {
    const actionWebsocketRef = useRef<WebSocket | null>(null);

    const [resignationPopupVisible, setResignationPopupVisible] =
        useState(false);

    useEffect(() => {
        const actionWebsocketUrl = `${websocketBaseURL}ws/action-server/?token=${getAccessToken()}&gameId=${gameId}`

        actionWebsocketRef.current = useWebSocket(actionWebsocketUrl, handleOnMessage);
        console.log(actionWebsocketRef.current)
        
        window.addEventListener("beforeunload", handleWindowUnload);

        return () => {
            if (actionWebsocketRef.current?.readyState === WebSocket.OPEN) {
                actionWebsocketRef.current.close();
            }

            window.removeEventListener("beforeunload", handleWindowUnload);
        }
    }, []);

    function handleWindowUnload() {
        if (actionWebsocketRef.current?.readyState === WebSocket.OPEN) {
            actionWebsocketRef.current.close();
        }
    }

    function handleResignationPopupDisplay() {
        setResignationPopupVisible(true);
    }

    function handleResignationConfirmation() {
        const resignationDetails = {
            type: "resign_request"
        }

        console.log(actionWebsocketRef.current)

        actionWebsocketRef.current?.send(JSON.stringify(resignationDetails));
    }

    function handleOnMessage(event: MessageEvent) {
        const parsedEventData = JSON.parse(event.data);
        const eventType = parsedEventData["type"];

        switch (eventType) {
            case WebSocketEventTypes.PLAYER_RESIGNED:
                handleResignation(parsedEventData);
                break;

            default:
                console.error(`Unknown even type ${eventType}`)
        }
    }

    function handleResignation(eventData: any) {
        console.log(eventData);

        setGameEnded(true);
        setGameEndedCause("Resignation");
        setGameWinner(eventData["winning_color"]);
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
