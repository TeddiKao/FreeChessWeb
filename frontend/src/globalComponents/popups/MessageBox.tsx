import { useEffect } from "react"
import { StateSetterFunction } from "../../types/general"
import { convertToMilliseconds } from "../../utils/timeUtils"

type MessageBoxProps = {
	visible: boolean,
	setVisible: StateSetterFunction<boolean>

	type: "info" | "error" | "warning" | "success",
	xAlignment: "left" | "center" | "right",
	yAlignment: "top" | "center" | "bottom",
	text: string,
	icon?: string,
	disappearAfterSeconds: number,
}

function MessageBox({ visible, setVisible, type, xAlignment, yAlignment, disappearAfterSeconds, text, icon }: MessageBoxProps) {
	useEffect(() => {
		const hideMessageBoxTimeout = setTimeout(() => {
			setVisible(false);
		}, convertToMilliseconds(disappearAfterSeconds))

		return () => {
			clearTimeout(hideMessageBoxTimeout);
		}
	})

	if (!visible) {
		return null;
	}
	
	function getMessageBoxTypeClass() {
		return `${type}-message-box`
	}

	function getMessageBoxXAlignClass() {
		return `${xAlignment}-align-message-box`
	}

	function getMessageBoxYAlignClass() {
		return `${yAlignment}-align-message-box`
	}

	return (
		<div className={`${getMessageBoxTypeClass()} ${getMessageBoxXAlignClass()} ${getMessageBoxYAlignClass()}`}>
			{icon && <img className="message-box-icon" src={icon} />}
			<p className="message-box-text">{text}</p>
		</div>
	)
}

export default MessageBox;