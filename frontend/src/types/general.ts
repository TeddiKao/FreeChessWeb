import { Dispatch, MutableRefObject, SetStateAction } from "react";

type StateSetterFunction<T>  = Dispatch<SetStateAction<T>>
type ChessboardSquareIndex = string | number

type OptionalValue<T> = T | null 
type RefObject<T> = MutableRefObject<T>

export type { StateSetterFunction, ChessboardSquareIndex, OptionalValue, RefObject }