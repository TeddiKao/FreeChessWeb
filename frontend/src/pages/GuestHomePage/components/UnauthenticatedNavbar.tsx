import { githubLink } from "../../../constants/urls";
import "../../../styles/navbar.scss";

function UnauthenticatedNavbar() {
    return (
        <div className="unauthenticated-navbar-container">
            <div className="site-links">
                <a href="/">Home</a>
                <a href="/features">Features</a>
                <a href={githubLink} target="_blank">GitHub</a>
            </div>

            <div className="authentication-links">
                <a href="/login" className="login-button">
                    Log in
                </a>
                <a href="/signup" className="signup-button">
                    Sign up
                </a>
            </div>
        </div>
    );
}

export default UnauthenticatedNavbar;
