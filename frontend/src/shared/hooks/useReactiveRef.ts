import { useCallback, useRef, useState } from "react";
import { RefObject, StateSetterFunction } from "../../types/general";

function useReactiveRef<T>(
	initialValue: T
): [RefObject<T>, T, StateSetterFunction<T>] {
	const ref = useRef(initialValue);
	const [currentValue, setCurrentValue] = useState(initialValue);

	const setRefValue = (newValue: any) => {
		ref.current = newValue;
		setCurrentValue(newValue);
	};

	return [ref, currentValue, setRefValue];
}

export default useReactiveRef;
