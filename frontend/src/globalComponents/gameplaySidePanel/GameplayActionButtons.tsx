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
    setGameEnded: StateSetterFunction<boolean>;
    setGameEndedCause: StateSetterFunction<string>;
    setGameWinner: StateSetterFunction<string>;
    setMessagePopupVisible: StateSetterFunction<boolean>;
    setMessageToDisplay: StateSetterFunction<string>;
};

function GameplayActionButtons({
    gameId,
    setGameEnded,
    setGameEndedCause,
    setGameWinner,
    setMessageToDisplay,
    setMessagePopupVisible
}: GameplayActionButtonsProps) {
    const actionWebsocketRef = useRef<WebSocket | null>(null);
    const actionWebsocketExists = useRef<boolean>(false);

    const [resignationPopupVisible, setResignationPopupVisible] =
        useState(false);

    const [drawOfferPopupVisible, setDrawOfferPopupVisible] = useState(false);

    useEffect(() => {
        if (actionWebsocketExists.current === false) {
            const actionWebsocketUrl = `${websocketBaseURL}ws/action-server/?token=${getAccessToken()}&gameId=${gameId}`;

            actionWebsocketRef.current = useWebSocket(
                actionWebsocketUrl,
                handleOnMessage
            );

            actionWebsocketExists.current = true;

            window.addEventListener("beforeunload", handleWindowUnload);
        }

        return () => {
            if (actionWebsocketRef.current?.readyState === WebSocket.OPEN) {
                actionWebsocketRef.current.close();
            }

            actionWebsocketExists.current = false;

            window.removeEventListener("beforeunload", handleWindowUnload);
        };
    }, []);

    function handleWindowUnload() {
        if (actionWebsocketRef.current?.readyState === WebSocket.OPEN) {
            actionWebsocketRef.current.close();
            actionWebsocketExists.current = false;
        }
    }

    function handleResignationPopupDisplay() {
        setResignationPopupVisible(true);
    }

    function handleDrawOfferPopupDisplay() {
        setDrawOfferPopupVisible(true);
    }

    function handleResignationConfirmation() {
        const resignationDetails = {
            type: "resign_request",
        };

        console.log(actionWebsocketRef.current);

        actionWebsocketRef.current?.send(JSON.stringify(resignationDetails));
    }

    function handleDrawOfferConfirmation() {
        const drawOfferDetails = {
            type: "draw_offered"
        }

        actionWebsocketRef?.current?.send(JSON.stringify(drawOfferDetails));

        setMessagePopupVisible(true);
        setMessageToDisplay("Draw offer sent")
    }

    function handleOnMessage(event: MessageEvent) {
        const parsedEventData = JSON.parse(event.data);
        const eventType = parsedEventData["type"];

        switch (eventType) {
            case WebSocketEventTypes.PLAYER_RESIGNED:
                handleResignation(parsedEventData);
                break;

            case WebSocketEventTypes.DRAW_OFFERED:
                console.log(`Draw offered by ${parsedEventData["offered_by"]}`)
                break;

            default:
                console.error(`Unknown even type ${eventType}`);
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
                    className="resignation-container"
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

                <div className="draw-offer-container" onClick={handleDrawOfferPopupDisplay}>
                    <p className="helper-text">Draw</p>

                    <ConfirmationPopup
                        isOpen={drawOfferPopupVisible}
                        setIsOpen={setDrawOfferPopupVisible}
                        confirmationMessage="Are you sure you want to offer a draw?"
                        confirmAction={handleDrawOfferConfirmation}
                    />
                </div>
            </div>
        </div>
    );
}

export default GameplayActionButtons;
