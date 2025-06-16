import useWebSocket from "./useWebsocket";

interface WebsocketWithLifecycleHookProps {
    url: string,
    enabled: boolean,
    onMessage: (data: any) => void;
    onError?: () => void
}

function useWebsocketWithLifecycle({ url, enabled, onMessage, onError }: WebsocketWithLifecycleHookProps) {
    const websocket = useWebSocket(url, onMessage, onError, enabled);
}

export default useWebsocketWithLifecycle;