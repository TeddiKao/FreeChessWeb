import "../styles/navbar.css"

function UnauthenticatedNavbar() {
	return (
		<div className="unauthenticated-navbar-container">
			<div className="site-links">
				<a>Home</a>
				<a>Features</a>
			</div>

			<div className="authentication-links">
				<a>Log in</a>
				<a>Sign up</a>
			</div>
		</div>
	)
}

export default UnauthenticatedNavbar