import { useState } from "react";

import api from "../api.js";
import "../styles/auth-form.css";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants.js";
import { useNavigate } from "react-router-dom";

function AuthForm({ method }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigate = useNavigate();

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handlePasswordVisibleChange(event) {
        setIsPasswordVisible(event.target.checked);
    }

    const loginUrl = "/users_api/token/get/";
    const signupUrl = "/users_api/create-user/";

    const url = method === "Login" ? loginUrl : signupUrl;

    function logUserIn(accessToken, refreshToken) {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
    }

    async function handleFormSubmit(event) {
        event.preventDefault();

        try {
            const userCredentials =
                method === "login"
                    ? { email, password }
                    : { email, username, password };

            const response = await api.post(url, userCredentials);

            if (method === "login") {
                logUserIn(response.data.access, response.data.refresh);
                navigate("/home");
            } else {
                // Log the user in

                try {
                    const loginResponse = await api.post(loginUrl, {
                        email,
                        password,
                    });

                    logUserIn(
                        loginResponse.data.access,
                        loginResponse.data.refresh
                    );
                    navigate("/home");
                } catch (error) {}
            }
        } catch (error) {
            console.log(error)
        }
    }

    let formSubtitleHTML = null;
    if (method === "Login") {
        formSubtitleHTML = (
            <p>
                Don't have an account yet? <a href="/signup">Sign up</a>
            </p>
        );
    } else {
        formSubtitleHTML = (
            <p>
                Already have an account? <a href="/login">Login</a>
            </p>
        );
    }

    const formTitle = method === "Login" ? "Login" : "Sign up";
    const shouldRenderUsername = method === "Signup";

    return (
        <div className="auth-form-container">
            <h1>{formTitle}</h1>
            <form className="auth-form" onSubmit={handleFormSubmit}>
                <input
                    type="email"
                    className="email-input"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                />
                <br />

                {shouldRenderUsername ? (
                    <>
                        <input
                            type="text"
                            className="username-input"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="Username"
                        />
                        <br />
                    </>
                ) : null}

                <input
                    type={isPasswordVisible ? "text" : "password"}
                    className="password-input"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                />
                <br />
                <div className="show-password-container">
                    <input
                        type="checkbox"
                        checked={isPasswordVisible}
                        className="show-password-checkbox"
                        onChange={handlePasswordVisibleChange}
                    />
                    <p>Show password</p>
                </div>

                <button type="submit" className="auth-form-submit">
                    {formTitle}
                </button>
            </form>
        </div>
    );
}

export default AuthForm;
