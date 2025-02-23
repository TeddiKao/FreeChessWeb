import { Dispatch, SetStateAction } from "react";

type StateSetterFunction<T>  = Dispatch<SetStateAction<T>>
type ChessboardSquareIndex = string | number

type OptionalValue<T> = T | null 

export type { StateSetterFunction, ChessboardSquareIndex, OptionalValue }