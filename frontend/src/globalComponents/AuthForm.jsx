import { useState } from "react";

import api from "../api.js";
import "../styles/auth-form.css"

function AuthForm({ method, url }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleFormSubmit(event) {}

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

    return (
        <div className="auth-form-container">
            <h1>{formTitle}</h1>
            <form className="auth-form" onSubmit={handleFormSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
					placeholder="Email"
                />
                <br />

                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
					placeholder="Username"
                />
                <br />

                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
					placeholder="Password"
                />
                <br />

                <button type="submit" className="auth-form-submit">{formTitle}</button>
            </form>
        </div>
    );
}

export default AuthForm;
