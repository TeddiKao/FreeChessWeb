import { createContext } from "react";
import { OptionalValue, StateSetterFunction } from "../../../../types/general";

const GameEndedSetterContext =
    createContext<OptionalValue<StateSetterFunction<boolean>>>(null);
const GameEndedCauseSetterContext =
    createContext<OptionalValue<StateSetterFunction<string>>>(
        null
    );
const GameWinnerSetterContext =
    createContext<OptionalValue<StateSetterFunction<OptionalValue<string>>>>(
        null
    );

export {
    GameEndedSetterContext,
    GameEndedCauseSetterContext,
    GameWinnerSetterContext,
};
