import { Navigate } from "react-router-dom";

import useIsAuthenticated from "@auth/useIsAuthenticated";
import { BaseWrapperProps } from "@shared/types/wrapper.types";

function ProtectedRoute({ children }: BaseWrapperProps) {
	const isAuthenticated = useIsAuthenticated();

	if (isAuthenticated === null) {
		return <div>Loading ...</div>;
	}

	return isAuthenticated ? children : <Navigate to={"/login"} />;
}

export default ProtectedRoute;
