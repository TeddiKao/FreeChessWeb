import React, { ChangeEvent, useState } from "react";

import "../styles/auth-form.scss";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { SignupErrors } from "../validationErrors";
import { isNullOrUndefined } from "../../../utils/generalUtils";
import AuthLoadingScreen from "../components/AuthLoadingScreen";
import api from "../../../app/api";

type AuthMethods = "Login" | "Signup";

type AuthFormProps = {
	method: string;
};

type UsernameFieldProps = {
	username: string;
	handleUsernameChange: (event: ChangeEvent<HTMLInputElement>) => void;
	usernameErrors: Array<string> | undefined;
};

function UsernameField({
	username,
	handleUsernameChange,
	usernameErrors,
}: UsernameFieldProps) {
	function getErrorElement(errorIndex: number, errorName: string) {
		switch (errorName) {
			case SignupErrors.USERNAME_ALREADY_EXISTS:
				return (
					<p key={errorIndex} className="username-error">
						This username is taken
					</p>
				);

			default:
				return (
					<p key={errorIndex} className="username-error">
						{errorName}
					</p>
				);
		}
	}

	function UsernameErrors() {
		return (
			<div className="username-errors-container">
				{usernameErrors!.map(
					(errorName: string, errorIndex: number) => {
						return getErrorElement(errorIndex, errorName);
					}
				)}
			</div>
		);
	}

	return (
		<>
			<p className="auth-input-helper-text">Username</p>
			<input
				type="text"
				className={
					usernameErrors?.length === 0 ||
					isNullOrUndefined(usernameErrors)
						? "username-input"
						: "error-username-input"
				}
				value={username}
				onChange={handleUsernameChange}
				placeholder="Username"
			/>
			<br />

			{usernameErrors && usernameErrors?.length > 0 && <UsernameErrors />}
		</>
	);
}

function AuthForm({ method }: AuthFormProps) {
	const [email, setEmail] = useState<string>("");
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [usernameErrors, setUsernameErrors] = useState<Array<string>>([]);
	const [emailErrors, setEmailErrors] = useState<Array<string>>([]);
	const [passwordErrors, setPasswordErrors] = useState<Array<string>>([]);

	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

	const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

	const navigate = useNavigate();

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

	function togglePasswordVisible() {
		setIsPasswordVisible((prevVisible) => !prevVisible);
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

		if (isAuthenticating) {
			return null;
		}

		setIsAuthenticating(true);

		const userCredentials =
			method === "Login"
				? { email, password }
				: { email, username, password };

		let response;

		try {
			response = await api.post(url, userCredentials);

			if (method === "Login") {
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
		} catch (error: any) {
			console.error(error);

			if (!(error instanceof AxiosError)) {
				return;
			}

			if (error.status === 400) {
				setPasswordErrors(error.response?.data?.password);
				setUsernameErrors(error.response?.data?.username);
				setEmailErrors(error.response?.data?.email);
			}
		}

		setIsAuthenticating(false);
	}

	function getShowPasswordPromptText() {
		return isPasswordVisible ? "Hide Password" : "Show Password";
	}

	const formTitle: string = method === "Login" ? "Login" : "Sign up";
	const shouldRenderUsernameField: boolean = method === "Signup";

	return (
		<>
			<div className="auth-form-container">
				<h1 className="auth-form-heading">{formTitle}</h1>
				<form className="auth-form" onSubmit={handleFormSubmit}>
					<div className="email-input-container">
						<p className="auth-input-helper-text">Email</p>
						<input
							type="email"
							className={
								emailErrors?.length === 0 ||
								isNullOrUndefined(emailErrors)
									? "email-input"
									: "error-email-input"
							}
							value={email}
							onChange={handleEmailChange}
							placeholder="Email address"
						/>
						<br />

						{emailErrors?.length > 0 && (
							<div className="email-errors-container">
								{emailErrors.map((errorName, errorIndex) => {
									console.log(`Error name: ${errorName}`);

									switch (errorName) {
										case SignupErrors.EMAIL_ALREADY_EXISTS:
											return (
												<p
													key={errorIndex}
													className="email-error"
												>
													This email is taken
												</p>
											);
									}
								})}
							</div>
						)}
					</div>

					{shouldRenderUsernameField ? (
						<div className="username-field-container">
							<UsernameField
								username={username}
								usernameErrors={usernameErrors}
								handleUsernameChange={handleUsernameChange}
							/>
						</div>
					) : null}

					<div className="password-items-container">
						<div className="password-input-container">
							<p className="auth-input-helper-text">Password</p>
							<input
								type={isPasswordVisible ? "text" : "password"}
								className={
									passwordErrors?.length === 0 ||
									isNullOrUndefined(passwordErrors)
										? "password-input"
										: "error-password-input"
								}
								value={password}
								onChange={handlePasswordChange}
								placeholder="Password"
							/>
							<br />
						</div>

						<div className="show-password-container">
							<p
								onClick={togglePasswordVisible}
								className="show-password-prompt"
							>
								{getShowPasswordPromptText()}
							</p>
						</div>

						{passwordErrors?.length > 0 && (
							<ul className="password-errors-container">
								{passwordErrors.map((error, index) => (
									<li key={index} className="password-error">
										{error}
									</li>
								))}
							</ul>
						)}
					</div>

					<FormSubtitle />

					<button type="submit" className="auth-form-submit">
						{formTitle}
					</button>
				</form>
			</div>

			<AuthLoadingScreen
				visible={isAuthenticating}
				authMethod={method as AuthMethods}
			/>
		</>
	);
}

export default AuthForm;
