import "@sharedStyles/layout/base-modal.scss";
import { ReactNode } from "react";
import ReactDom from "react-dom";

type BaseModalProps = {
	children: ReactNode;
	visible: boolean;
};

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
