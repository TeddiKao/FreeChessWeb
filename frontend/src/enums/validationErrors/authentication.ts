enum LoginErrors {

}

enum SignupErrors {
	USERNAME_ALREADY_EXISTS = "user auth model with this username already exists.",
	EMAIL_ALREADY_EXISTS = "user auth model with this email already exists."

}

export { LoginErrors, SignupErrors }