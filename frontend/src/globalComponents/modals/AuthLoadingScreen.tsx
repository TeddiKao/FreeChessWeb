import LoadingSpinner from "../LoadingSpinner";

type AuthLoadingScreenProps = {
    authMethod: "login" | "signup"
}

function AuthLoadingScreen({ authMethod }: AuthLoadingScreenProps) {
    return (
        <div className="auth-loading-screen-container">
            <h4 className="auth-method">{authMethod}</h4>
            <LoadingSpinner />
            <p className="please-wait-text">Please wait</p>
        </div>
    )
}

export default AuthLoadingScreen;