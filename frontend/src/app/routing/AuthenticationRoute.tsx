import { Navigate } from "react-router-dom";

import useIsAuthenticated from "@auth/useIsAuthenticated";
import { BaseWrapperProps } from "@shared/types/wrapper.types";

function AuthenticationRoute({ children }: BaseWrapperProps) {
	const isAuthenticated = useIsAuthenticated();

	if (isAuthenticated === null) {
		return <div>Loading ...</div>;
	}

	return isAuthenticated ? <Navigate to="/home" /> : children;
}

export default AuthenticationRoute;
