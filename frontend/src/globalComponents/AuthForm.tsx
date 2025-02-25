import React, { ChangeEvent, ReactElement, useState } from "react";

import api from "../api.js";
import "../styles/auth-form.css";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/tokens.js";
import { useNavigate } from "react-router-dom";

type AuthFormProps = {
    method: string;
};

function AuthForm({ method }: AuthFormProps) {
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const navigate = useNavigate();

    function UsernameField() {
        return (
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
        );
    }

    function FormSubtitle() {
        const loginPageSubititle = (
            <p className="form-subtitle">
                Don't have an account yet? <a href="/signup">Sign up</a>
            </p>
        );

        const signupPageSubititle = (
            <p className="form-subtitle">
                Already have an account? <a href="/login">Login</a>
            </p>
        );

        return method === "Login" ? loginPageSubititle : signupPageSubititle;
    }

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    function handlePasswordVisibleChange(event: ChangeEvent<HTMLInputElement>) {
        setIsPasswordVisible(event.target.checked);
    }

    const loginUrl = "/users_api/token/get/";
    const signupUrl = "/users_api/create-user/";

    const url = method === "Login" ? loginUrl : signupUrl;

    function handleLogin(accessToken: string, refreshToken: string) {
        logUserIn(accessToken, refreshToken);
        navigate("/home");
    }

    function logUserIn(accessToken: string, refreshToken: string) {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
    }

    async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const userCredentials =
                method === "login"
                    ? { email, password }
                    : { email, username, password };

            const response = await api.post(url, userCredentials);

            if (method === "login") {
                handleLogin(response.data.access, response.data.refresh);
            } else {
                // Log the user in

                try {
                    const loginResponse = await api.post(loginUrl, {
                        email,
                        password,
                    });

                    handleLogin(
                        loginResponse.data.access,
                        loginResponse.data.refresh
                    );
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const formTitle: string = method === "Login" ? "Login" : "Sign up";
    const shouldRenderUsernameField: boolean = method === "Signup";

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

                {shouldRenderUsernameField ? <UsernameField /> : null}

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

                <FormSubtitle />

                <button type="submit" className="auth-form-submit">
                    {formTitle}
                </button>
            </form>
        </div>
    );
}

export default AuthForm;
