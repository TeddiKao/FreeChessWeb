import { createContext } from "react";

const GameEndedSetterContext = createContext(null);
const GameEndedCauseSetterContext = createContext(null);
const GameWinnerSetterContext = createContext(null);

export { GameEndedSetterContext, GameEndedCauseSetterContext, GameWinnerSetterContext};