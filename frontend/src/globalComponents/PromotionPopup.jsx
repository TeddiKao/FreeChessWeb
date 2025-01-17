import { capitaliseFirstLetter } from "../utils/generalUtils";

function PromotionPopup({ color }) {
	return (
		<div className="promotion-popup-container">
			<img src={`${color}Queen`}/>
			<img src={`${color}Rook`}/>
			<img src={`${color}Knight`}/>
			<img src={`${color}Bishop`}/>
		</div>
	)
}

export default PromotionPopup;