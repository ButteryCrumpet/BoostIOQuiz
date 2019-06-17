import { Result } from "true-myth"

export type AsyncResult<T, E> = Promise<Result<T, E>>

export interface Reader<T, U> {
  get: (id: U) => AsyncResult<T, string>
  getMulti: (ids: U[]) => AsyncResult<T[], string>
  getAll: () => AsyncResult<T[], string>
}

export type Writable<T> = {
  [P in keyof T]: P extends "id" ?  T[P] | null : T[P]
} & {
  id?: string | number
}


export type Writer<T> = (data: Writable<T> | { [P in keyof T]: Writable<T[P]> }) => AsyncResult<T, string>
export type WriterArray<T extends { [P in keyof T]: Writable<T[P]> }> = (data: T) => AsyncResult<T, string>