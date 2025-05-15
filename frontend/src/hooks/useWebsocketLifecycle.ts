import { useEffect } from "react";
import {
	OptionalValue,
	RefObject,
	StateSetterFunction,
} from "../types/general";

type WebSocketLifecycleHookProps = {
	websocketRef: RefObject<OptionalValue<WebSocket>>;
	websocketExistsRef: RefObject<boolean>;
	setWebsocketEnabled: StateSetterFunction<boolean>;
	handleWindowUnload: () => void;
};

function useWebsocketLifecycle({
	websocketRef,
	websocketExistsRef,
	setWebsocketEnabled,
	handleWindowUnload,
}: WebSocketLifecycleHookProps) {
	useEffect(() => {
		if (websocketExistsRef.current === false) {
			window.addEventListener("beforeunload", handleWindowUnload);
		}

		return () => {
			window.removeEventListener("beforeunload", handleWindowUnload);
		};
	}, []);
}

export default useWebsocketLifecycle;
