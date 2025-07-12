import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isNullOrUndefined } from "@sharedUtils/generalUtils";

type LocationState = {
	route: string;
	routeState: Record<string, any> | null;
};

function TempRoute() {
	const location = useLocation();

	const locationState: LocationState = location.state;
	const routeToRedirect = locationState.route;
	const routeState = locationState.routeState;

	if (isNullOrUndefined(routeToRedirect)) {
		return null;
	}

	if (isNullOrUndefined(routeState)) {
		return null;
	}

	const navigate = useNavigate();

	useEffect(() => {
		navigate(routeToRedirect, {
			state: routeState,
		});
	}, [routeToRedirect, routeState, navigate]);

	return <div className="temp-route-placeholder"></div>;
}

export default TempRoute;
