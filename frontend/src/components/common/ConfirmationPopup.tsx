import "../../styles/popups/confirmation-popup.scss";

type ConfirmationPopupProps = {
    confirmationMessage: string;
    confirmAction: () => void;
    cancelAction?: () => void;
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

        if (cancelAction) {
            cancelAction();
        }
    }

    return (
        <div
            className="confirmation-popup-container"
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            {title ? <h3>{title}</h3> : null}
            <p className="confirmation-message">{confirmationMessage}</p>
            <div className="confirmation-buttons-container">
                <button className="confirm-button" onClick={handleConfirmation}>
                    Yes
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                    No
                </button>
            </div>
        </div>
    );
}

export default ConfirmationPopup;
