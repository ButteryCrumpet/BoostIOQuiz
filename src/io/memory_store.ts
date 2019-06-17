import { Reader, Writer } from "./types";
import { Balance, Deposit, ID, Withdraw, Transfer } from "../domain/balance";
import { Result } from "true-myth";

interface Store<T> {
  [key: string]: T
}

const store = {
  balances: {} as Store<Balance>,
  deposits: {} as Store<Deposit>,
  widthdrawls: {} as Store<Withdraw>,
  transfers: {} as Store<Transfer>
};

export const balanceReader = readerFactory(store.balances)
export const depositReader = readerFactory(store.deposits)

export const balanceWriter = writeFactory(store.balances)

function readerFactory<T>(store: Store<T>): Reader<T, ID> {
  return {
    get: (id) => Promise.resolve(id in store ? Result.ok(store[id]) : Result.err("not found")),
    getMulti: (ids) => {
      const items = ids.map(id => id in store ? store[id] : null)
      const result = items.every(item => item !== null)
        ? Result.ok(items) as Result<T[], string>
        : Result.err("some ids were not found") as Result<T[], string>
      return Promise.resolve(result)
    },
    getAll: () => Promise.resolve(Result.ok(Object.values(store)))
  }
}

function writeFactory<T>(store: Store<T>): Writer<T> {
  return function(data) {
    //
  }
}

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}