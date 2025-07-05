import { Dispatch, MutableRefObject, SetStateAction } from "react";

type StateSetterFunction<T>  = Dispatch<SetStateAction<T>>

type OptionalValue<T> = T | null 
type RefObject<T> = MutableRefObject<T>

export type { StateSetterFunction, OptionalValue, RefObject }