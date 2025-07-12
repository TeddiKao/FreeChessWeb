import LoadingSpinner from "@sharedComponents/LoadingSpinner";
import "@auth/styles/auth-loading-screen.scss";
import BaseModal from "@sharedComponents/layout/BaseModal";

type AuthLoadingScreenProps = {
	visible: boolean;
	authMethod: "Login" | "Signup";
};

function AuthLoadingScreen({ visible, authMethod }: AuthLoadingScreenProps) {
	function getLoadingText() {
		if (authMethod === "Login") {
			return "Logging in";
		} else {
			return "Signing up";
		}
	}

	if (!visible) {
		return null;
	}

	return (
		<BaseModal visible={visible}>
			<div className="auth-loading-screen-container">
				<h3 className="auth-method">{getLoadingText()}</h3>
				<LoadingSpinner />
				<p className="please-wait-text">Please wait</p>
			</div>
		</BaseModal>
	);
}

export default AuthLoadingScreen;
