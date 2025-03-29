type MessageBoxProps = {
	type: "info" | "error" | "warning" | "success",
	xAlignment: "left" | "center" | "right",
	yAlignment: "top" | "center" | "bottom",
	text: string,
	icon?: string,
}

function MessageBox({ type, xAlignment, yAlignment, text, icon }: MessageBoxProps) {
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
			{icon && <img className="message-box-icon" src={icon}/>}
			<p className="message-box-text">{text}</p>
		</div>
	)
}

export default MessageBox;