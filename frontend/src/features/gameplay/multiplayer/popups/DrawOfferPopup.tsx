import "../styles/draw-offer-popup.scss";
import { RefObject } from "../../../../types/general";

type DrawOfferPopupProps = {
	visible: boolean;
	onClose: () => void;
	actionWebsocketRef: RefObject<WebSocket | null>;
};

function DrawOfferPopup({
	visible,
	onClose,
	actionWebsocketRef,
}: DrawOfferPopupProps) {
	if (!actionWebsocketRef || !actionWebsocketRef.current) {
		return null;
	}

	function handleDrawAccept() {
		onClose();

		actionWebsocketRef.current?.send(
			JSON.stringify({
				type: "draw_offer_accepted",
			})
		);
	}

	function handleDrawDecline() {
		onClose();

		actionWebsocketRef.current?.send(
			JSON.stringify({
				type: "draw_offer_declined",
			})
		);
	}

	if (!visible) {
		return;
	}

	return (
		<div className="draw-offer-popup-container">
			<h3 className="draw-offer-popup-heading">Draw offer</h3>
			<p className="accept-draw-prompt">Accept draw?</p>
			<div className="action-buttons-container">
				<button
					onClick={handleDrawAccept}
					className="accept-draw-button"
				>
					Accept
				</button>
				<button
					onClick={handleDrawDecline}
					className="decline-draw-button"
				>
					Decline
				</button>
			</div>
		</div>
	);
}

export default DrawOfferPopup;
