import { Navigate } from "react-router-dom";

import useIsAuthenticated from "../../hooks/useIsAuthenticated.ts";

function ProtectedRoute({ children }) {
    const isAuthenticated = useIsAuthenticated();

    if (isAuthenticated === null) {
        return <div>Loading ...</div>;
    }

    return isAuthenticated ? children : <Navigate to={"/login"} />;
}

export default ProtectedRoute;
