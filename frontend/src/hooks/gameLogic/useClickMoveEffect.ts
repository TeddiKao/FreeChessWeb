import { useEffect } from "react";

function useClickMoveEffect(clickDeps: any[], clickMoveCallback: () => void) {
    useEffect(() => {
        clickMoveCallback();
    }, [...clickDeps, clickMoveCallback]);
}   

export default useClickMoveEffect;