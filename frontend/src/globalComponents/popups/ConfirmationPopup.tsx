type ConfirmationPopupProps = {
    confirmationMessage: string;
    confirmAction: () => void;
    cancelAction: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    title?: string;
};

function ConfirmationPopup({
    confirmationMessage,
    confirmAction,
    cancelAction,
    isOpen,
    setIsOpen,
    title,
}: ConfirmationPopupProps) {
	if (!isOpen) {
		return null;
	}

	function handleConfirmation() {
		setIsOpen(false);
		confirmAction();
	}

	function handleCancel() {
		setIsOpen(false);
        cancelAction();
	}

	return (
		<div className="confirmation-popup-container">
			<p className="confirmation-message">{confirmationMessage}</p>
			<div className="confirmation-buttons-container">
				<button className="confirm-button" onClick={handleConfirmation}>Yes</button>
				<button className="cancel-button" onClick={handleCancel}>No</button>
			</div>
		</div>
	)
}

export default ConfirmationPopup;