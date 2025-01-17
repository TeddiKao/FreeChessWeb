import "../styles/promotion-popup.css";

function PromotionPopup({ color }) {
    const positionClass = color === "White" ? "top" : "bottom";

    function generatePromotionPopup() {
        if (color === "White") {
            return (
                <div className={`promotion-popup-container ${positionClass}`}>
                    <img src={`/${color.toLowerCase()}Queen.svg`} />
                    <img src={`/${color.toLowerCase()}Rook.svg`} />
                    <img src={`/${color.toLowerCase()}Knight.svg`} />
                    <img src={`/${color.toLowerCase()}Bishop.svg`} />
                </div>
            );
        } else {
            return (
                <div className={`promotion-popup-container ${positionClass}`}>
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
