import { useState, useEffect, useRef } from "react";

import "../../../styles/features/gameplay/gameplay-action-buttons.scss";
import { RefObject, StateSetterFunction } from "../../../types/general";
import useReactiveRef from "../../../hooks/useReactiveRef";
import useWebSocket from "../../../hooks/useWebsocket";
import { websocketBaseURL } from "../../../constants/urls";
import { ActionWebSocketEventTypes } from "../../../enums/gameLogic";
import ConfirmationPopup from "../../../components/common/ConfirmationPopup";
import { getAccessToken } from "../../../utils/tokenUtils";
import useWebsocketWithLifecycle from "../../../hooks/useWebsocketWithLifecycle";
import { PieceColor } from "../../../types/gameLogic";

type GameplayActionButtonsProps = {
	gameId: string | number;
	parentActionWebsocket: RefObject<WebSocket | null>;
	setGameEnded: StateSetterFunction<boolean>;
	setGameEndedCause: StateSetterFunction<string>;
	setGameWinner: StateSetterFunction<PieceColor | "">;
	setMessagePopupVisible: StateSetterFunction<boolean>;
	setMessageToDisplay: StateSetterFunction<string>;
	setDrawOfferReceived: StateSetterFunction<boolean>;
};

function GameplayActionButtons({
	parentActionWebsocket,
	gameId,
	setGameEnded,
	setGameEndedCause,
	setGameWinner,
	setMessageToDisplay,
	setMessagePopupVisible,
	setDrawOfferReceived,
}: GameplayActionButtonsProps) {
	const [resignationPopupVisible, setResignationPopupVisible] =
		useState(false);
	const [drawOfferPopupVisible, setDrawOfferPopupVisible] = useState(false);

	const actionWebsocketUrl = `${websocketBaseURL}/ws/action-server/?token=${getAccessToken()}&gameId=${gameId}`;

	const {
		socketRef: actionWebsocketRef,
		socket: actionWebsocket,
		socketEnabled: actionWebsocketEnabled,
	} = useWebsocketWithLifecycle({
		url: actionWebsocketUrl,
		enabled: true,
		onMessage: handleOnMessage,
	});

	useEffect(() => {
		parentActionWebsocket.current = actionWebsocket;
	}, [actionWebsocketEnabled, actionWebsocket]);

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

		actionWebsocketRef.current?.send(JSON.stringify(resignationDetails));
	}

	function handleDrawOfferConfirmation() {
		const drawOfferDetails = {
			type: "draw_offered",
		};

		actionWebsocketRef?.current?.send(JSON.stringify(drawOfferDetails));

		setMessagePopupVisible(true);
		setMessageToDisplay("Draw offer sent");
	}

	function handleOnMessage(event: MessageEvent) {
		const parsedEventData = JSON.parse(event.data);
		const eventType = parsedEventData["type"];

		switch (eventType) {
			case ActionWebSocketEventTypes.PLAYER_RESIGNED:
				handleResignation(parsedEventData);
				break;

			case ActionWebSocketEventTypes.DRAW_OFFERED:
				handleDrawOffered();
				break;

			case ActionWebSocketEventTypes.DRAW_OFFER_ACCPETED:
				handleDrawAccepted();
				break;

			case ActionWebSocketEventTypes.DRAW_OFFER_DECLINED:
				handleDrawDeclined();
				break;

			default:
				console.error(`Unknown even type ${eventType}`);
		}
	}

	function handleResignation(eventData: any) {
		setGameEnded(true);
		setGameEndedCause("Resignation");
		setGameWinner(eventData["winning_color"]);
	}

	function handleDrawOffered() {
		setDrawOfferReceived(true);
	}

	function handleDrawDeclined() {
		setMessagePopupVisible(true);
		setMessageToDisplay("Draw declined");
	}

	function handleDrawAccepted() {
		setGameEnded(true);
		setGameEndedCause("Agreement");
	}

	return (
		<div className="gameplay-action-buttons-container">
			<h4 className="gameplay-action-buttons-header">Gameplay actions</h4>
			<div className="gameplay-action-buttons">
				<div
					onClick={handleResignationPopupDisplay}
					className="resignation-container"
				>
					<img
						className="resign-icon"
						src="/icons/gameplay/sidePanel/resignButton.svg"
					/>
					<p className="helper-text">Resign</p>

					<ConfirmationPopup
						isOpen={resignationPopupVisible}
						setIsOpen={setResignationPopupVisible}
						confirmationMessage="Are you sure you want to resign?"
						confirmAction={handleResignationConfirmation}
					/>
				</div>

				<div
					className="draw-offer-container"
					onClick={handleDrawOfferPopupDisplay}
				>
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
