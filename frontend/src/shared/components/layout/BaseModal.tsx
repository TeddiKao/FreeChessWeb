import { BaseWrapperProps } from "@/shared/types/wrapper.types";
import "@sharedStyles/layout/base-modal.scss";
import ReactDom from "react-dom";

interface BaseModalProps extends BaseWrapperProps {
	visible: boolean;
}

function BaseModal({ children, visible }: BaseModalProps) {
	const portalRoot = document.getElementById("portal");
	if (!portalRoot) {
		return null;
	}

	if (!visible) {
		return null;
	}

	return ReactDom.createPortal(
		<div className="modal-wrapper">
			<div className="modal-overlay"></div>
			{children}
		</div>,
		portalRoot
	);
}

export default BaseModal;
