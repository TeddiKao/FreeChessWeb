import { useEffect, useRef } from "react";

import "../../styles/chessboard/promotion-popup.scss";
import { PieceColor, PieceType } from "@sharedTypes/chessTypes/pieces.types";

type PromotionCancelFunction = (color: PieceColor) => void;

type PawnPromotionFunction = (
	color: PieceColor,
	promotedPiece: PieceType
) => void;

type PromotionPopupProps = {
	color: PieceColor;
	isOpen: boolean;
	onClose: () => void;
	handlePromotionCancel: PromotionCancelFunction;
	handlePawnPromotion: PawnPromotionFunction;
	boardOrientation: string;
};

function PromotionPopup({
	color,
	isOpen,
	onClose,
	handlePromotionCancel,
	handlePawnPromotion,
	boardOrientation,
}: PromotionPopupProps) {
	console.log(boardOrientation.toLowerCase(), color.toLowerCase());

	const positionClass: string =
		boardOrientation.toLowerCase() === color.toLowerCase()
			? "top"
			: "bottom";
	const promotionMenu: any = useRef(null);

	function handleClickOutside(event: MouseEvent) {
		if (
			promotionMenu.current &&
			!promotionMenu.current.contains(event.target)
		) {
			onClose();
			handlePromotionCancel(color);
		}
	}

	function handlePieceClick(pieceType: PieceType) {
		handlePawnPromotion(color, pieceType);
	}

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	if (!isOpen) {
		return null;
	}

	function generatePromotionPopup() {
		if (positionClass.toLowerCase() === "top") {
			return (
				<div
					ref={promotionMenu}
					className={`promotion-popup-container ${positionClass}`}
				>
					<img
						onClick={() => {
							handlePieceClick("queen");
						}}
						src={`/icons/chessPieces/regular/${color.toLowerCase()}Queen.svg`}
					/>

					<img
						onClick={() => {
							handlePieceClick("rook");
						}}
						src={`/icons/chessPieces/regular/${color.toLowerCase()}Rook.svg`}
					/>

					<img
						onClick={() => {
							handlePieceClick("knight");
						}}
						src={`/icons/chessPieces/regular/${color.toLowerCase()}Knight.svg`}
					/>

					<img
						onClick={() => {
							handlePieceClick("bishop");
						}}
						src={`/icons/chessPieces/regular/${color.toLowerCase()}Bishop.svg`}
					/>
				</div>
			);
		} else {
			return (
				<div
					ref={promotionMenu}
					className={`promotion-popup-container ${positionClass}`}
				>
					<img
						onClick={() => {
							handlePieceClick("bishop");
						}}
						src={`/icons/chessPieces/regular/${color.toLowerCase()}Bishop.svg`}
					/>

					<img
						onClick={() => {
							handlePieceClick("knight");
						}}
						src={`/icons/chessPieces/regular/${color.toLowerCase()}Knight.svg`}
					/>

					<img
						onClick={() => {
							handlePieceClick("rook");
						}}
						src={`/icons/chessPieces/regular/${color.toLowerCase()}Rook.svg`}
					/>

					<img
						onClick={() => {
							handlePieceClick("queen");
						}}
						src={`/icons/chessPieces/regular/${color.toLowerCase()}Queen.svg`}
					/>
				</div>
			);
		}
	}

	return generatePromotionPopup();
}

export default PromotionPopup;
