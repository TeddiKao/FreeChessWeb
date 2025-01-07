function AuthForm({ method, url }) {
	const formTitle = method === "Login" ? "Login" : "Signup"
	
	let formSubtitleHTML = null;
	if (method === "Login") {
		formSubtitleHTML = (
			<p>Don't have an account yet? <a href="/signup">Sign up</a></p>
		)
	} else {
		formSubtitleHTML = (
			<p>Already have an account? <a href="/login">Login</a></p>
		)
	}

	return (
		<div className="auth-form-container">
			<h1>{formTitle}</h1>
		</div>
	)
}

export default AuthForm