import { useEffect, useRef } from "react";

import "../styles/components/chessboard/chessboard.css";
import { PieceColor, PieceType } from "../types/gameLogic";
import { OptionalValue } from "../types/general";

type PromotionCancelFunction = (
    color: PieceColor
) => void;

type PawnPromotionFunction = (
    color: PieceColor,
    promotedPiece: PieceType,
    moveMethod: string,
    autoQueen?: boolean
) => void

type PromotionPopupProps = {
    color: PieceColor;
    isOpen: boolean;
    onClose: () => void;
    handlePromotionCancel: PromotionCancelFunction, 
    handlePawnPromotion: PawnPromotionFunction,
    boardOrientation: string,
    moveMethod: OptionalValue<string>
};

function PromotionPopup({
    color,
    isOpen,
    onClose,
    handlePromotionCancel,
    handlePawnPromotion,
    boardOrientation,
    moveMethod,
}: PromotionPopupProps) {
    const positionClass: string =
        boardOrientation.toLowerCase() === color.toLowerCase()
            ? "top"
            : "bottom";
    const promotionMenu: any = useRef(null);

    function handleClickOutside(event: any) {
        if (
            promotionMenu.current &&
            !promotionMenu.current.contains(event.target)
        ) {
            onClose();
            handlePromotionCancel(color);
        }
    }

    function handlePieceClick(pieceType: PieceType) {
        if (!moveMethod) {
            return;
        }

        handlePawnPromotion(color, pieceType, moveMethod);
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
                        src={`/${color.toLowerCase()}Queen.svg`}
                    />

                    <img
                        onClick={() => {
                            handlePieceClick("rook");
                        }}
                        src={`/${color.toLowerCase()}Rook.svg`}
                    />

                    <img
                        onClick={() => {
                            handlePieceClick("knight");
                        }}
                        src={`/${color.toLowerCase()}Knight.svg`}
                    />

                    <img
                        onClick={() => {
                            handlePieceClick("bishop");
                        }}
                        src={`/${color.toLowerCase()}Bishop.svg`}
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
                        src={`/${color.toLowerCase()}Bishop.svg`}
                    />

                    <img
                        onClick={() => {
                            handlePieceClick("knight");
                        }}
                        src={`/${color.toLowerCase()}Knight.svg`}
                    />

                    <img
                        onClick={() => {
                            handlePieceClick("rook");
                        }}
                        src={`/${color.toLowerCase()}Rook.svg`}
                    />

                    <img
                        onClick={() => {
                            handlePieceClick("queen");
                        }}
                        src={`/${color.toLowerCase()}Queen.svg`}
                    />
                </div>
            );
        }
    }

    return generatePromotionPopup();
}

export default PromotionPopup;
