import { createContext } from "react";
import {
	OptionalValue,
	StateSetterFunction,
} from "../../../../shared/types/utility.types";

const GameEndedSetterContext =
	createContext<OptionalValue<StateSetterFunction<boolean>>>(null);
const GameEndedCauseSetterContext =
	createContext<OptionalValue<StateSetterFunction<string>>>(null);
const GameWinnerSetterContext =
	createContext<OptionalValue<StateSetterFunction<OptionalValue<string>>>>(
		null
	);

export {
	GameEndedSetterContext,
	GameEndedCauseSetterContext,
	GameWinnerSetterContext,
};
