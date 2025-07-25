import { useEffect, useRef } from "react";
import { StateSetterFunction } from "@sharedTypes/utility.types";
import { convertToMilliseconds } from "@sharedUtils/timeUtils";

import "@sharedStyles/message-box.scss";
import {
	MessageBoxTypes,
	XAlignment,
	YAlignment,
} from "@sharedTypes/messageBox.types";

type MessageBoxProps = {
	setVisible: StateSetterFunction<boolean>;

	type: MessageBoxTypes;
	xAlignment: XAlignment;
	yAlignment: YAlignment;
	text: string;
	icon?: string;
	disappearAfterSeconds: number;
};

function MessageBox({
	setVisible,
	type,
	xAlignment,
	yAlignment,
	disappearAfterSeconds,
	text,
	icon,
}: MessageBoxProps) {
	useEffect(() => {
		const hideMessageBoxTimeout = setTimeout(() => {
			setVisible(false);
		}, convertToMilliseconds(disappearAfterSeconds));

		return () => {
			clearTimeout(hideMessageBoxTimeout);
		};
	}, []);

	function getMessageBoxTypeClass() {
		return `${type}-message-box`;
	}

	function getMessageBoxXAlignClass() {
		return `${xAlignment}-align-x-message-box`;
	}

	function getMessageBoxYAlignClass() {
		return `${yAlignment}-align-y-message-box`;
	}

	return (
		<div
			className={`message-box-container ${getMessageBoxTypeClass()} ${getMessageBoxXAlignClass()} ${getMessageBoxYAlignClass()}`}
		>
			{icon && <img className="message-box-icon" src={icon} />}
			<p className="message-box-text">{text}</p>
		</div>
	);
}

export default MessageBox;
