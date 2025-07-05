import { useEffect } from "react";
import {
	OptionalValue,
	RefObject,
	StateSetterFunction,
} from "../../../types/general";

type WebSocketLifecycleHookProps = {
	websocket: OptionalValue<WebSocket>;
	websocketRef: RefObject<OptionalValue<WebSocket>>;
	websocketExistsRef: RefObject<boolean>;
	setWebsocketEnabled: StateSetterFunction<boolean>;
	handleWindowUnload: () => void;
};

function useWebsocketLifecycle({
	websocket,
	websocketRef,
	websocketExistsRef,
	setWebsocketEnabled,
	handleWindowUnload,
}: WebSocketLifecycleHookProps) {
	useEffect(() => {
		if (websocketExistsRef.current === false) {
			window.addEventListener("beforeunload", handleWindowUnload);

			websocketRef.current = websocket;
			websocketExistsRef.current = true;

			setWebsocketEnabled(true);
		}

		return () => {
			window.removeEventListener("beforeunload", handleWindowUnload);

			if (websocketRef.current?.readyState === WebSocket.OPEN) {
				websocketRef.current.close();
				websocketExistsRef.current = false;
			}
		};
	}, []);
}

export default useWebsocketLifecycle;
