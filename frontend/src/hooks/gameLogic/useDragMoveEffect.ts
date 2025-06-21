import { useEffect } from "react";

function useClickMoveEffect(dragDeps: any[], dragMoveCallback: () => void) {
    useEffect(() => {
        dragMoveCallback();
    }, [...dragDeps, dragMoveCallback]);
}   

export default useClickMoveEffect;