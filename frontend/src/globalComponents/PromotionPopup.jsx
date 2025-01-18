import React, {useEffect, useRef} from "react";

import "../styles/promotion-popup.css";

function PromotionPopup({ color, isOpen, onClose }) {
    const positionClass = color.toLowerCase() === "white" ? "top" : "bottom";
    const promotionMenu = useRef(null);

    function handleClickOutside(event) {
        if (promotionMenu.current && !promotionMenu.current.contains(event.target)) {
            onClose();
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    if (!isOpen) {
        return null;
    }

    function generatePromotionPopup() {
        if (color.toLowerCase() === "white") {
            return (
                <div ref={promotionMenu} className={`promotion-popup-container ${positionClass}`}>
                    <img src={`/${color.toLowerCase()}Queen.svg`} />
                    <img src={`/${color.toLowerCase()}Rook.svg`} />
                    <img src={`/${color.toLowerCase()}Knight.svg`} />
                    <img src={`/${color.toLowerCase()}Bishop.svg`} />
                </div>
            );

        } else {
            return (
                <div ref={promotionMenu} className={`promotion-popup-container ${positionClass}`}>
                    <img src={`/${color.toLowerCase()}Bishop.svg`} />
                    <img src={`/${color.toLowerCase()}Knight.svg`} />
                    <img src={`/${color.toLowerCase()}Rook.svg`} />
                    <img src={`/${color.toLowerCase()}Queen.svg`} />
                </div>
            );

        }
    }

    return generatePromotionPopup();
}

export default PromotionPopup;
