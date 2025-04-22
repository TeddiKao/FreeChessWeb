import LoadingSpinner from "../LoadingSpinner";
import "../../styles/modals/auth-loading-screen.scss";
import ModalWrapper from "../wrappers/ModalWrapper";

type AuthLoadingScreenProps = {
	visible: boolean;
	authMethod: "login" | "signup";
};

function AuthLoadingScreen({ visible, authMethod }: AuthLoadingScreenProps) {
	if (!visible) {
		return null;
	}

	return (
		<ModalWrapper visible={visible}>
			<div className="auth-loading-screen-container">
				<h4 className="auth-method">{authMethod}</h4>
				<LoadingSpinner />
				<p className="please-wait-text">Please wait</p>
			</div>
		</ModalWrapper>
	);
}

export default AuthLoadingScreen;
