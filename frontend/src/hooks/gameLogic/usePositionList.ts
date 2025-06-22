import { useEffect, useState } from "react";
import { PositionList } from "../../interfaces/gameLogic";
import { fetchPositionList } from "../../utils/apiUtils";

function usePositionList(gameId: number) {
    const [positionList, setPositionList] = useState<PositionList>([]);

    useEffect(() => {
        updatePositionList();
    }, [gameId]);

    async function updatePositionList() {
		const positionList = await fetchPositionList(gameId);

		setPositionList(positionList);
	}
}

export default usePositionList;