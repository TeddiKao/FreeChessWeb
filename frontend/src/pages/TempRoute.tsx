import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type LocationState = {
    route: string,
    routeState: Record<string, any> | null
}

function TempRoute() {
    const location = useLocation();

    const locationState: LocationState = location.state;
    const routeToRedirect = locationState.route;
    const routeState = locationState.routeState;

    const navigate = useNavigate();

    useEffect(() => {
        navigate(routeToRedirect, {
            state: routeState
        })
    }, []);

    return (
        <div className="temp-route-placeholder"></div>
    )
}

export default TempRoute;