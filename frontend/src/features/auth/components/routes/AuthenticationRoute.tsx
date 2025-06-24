import { Navigate } from "react-router-dom";

import useIsAuthenticated from "../../useIsAuthenticated";

function AuthenticationRoute({ children }) {
	const isAuthenticated = useIsAuthenticated();

	if (isAuthenticated === null) {
		return <div>Loading ...</div>;
	}

	return isAuthenticated ? <Navigate to="/home" /> : children;
}

export default AuthenticationRoute;
