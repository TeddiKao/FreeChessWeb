import { useEffect } from "react";

function useDragMoveEffect(dragDeps: any[], dragMoveCallback: () => void) {
    useEffect(() => {
        dragMoveCallback();
    }, [...dragDeps, dragMoveCallback]);
}   

export default useDragMoveEffect;