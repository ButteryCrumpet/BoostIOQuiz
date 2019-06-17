import { Result } from "true-myth"
import { Deposit, Balance, Withdraw, Transfer, deposit, withdraw, transfer, newDeposit, newWithdraw, newTransfer, ID } from "./balance";
import { BalanceCreateRequestBody, DepositCreateRequestBody, WithdrawCreateRequestBody, TransferCreateRequestBody } from "./commands";
import { Reader, Writer, AsyncResult, Writable, WriterArray } from "../io/types"


export function showBalance(reader: Reader<Balance, ID>) {
  return function (id: ID): AsyncResult<Balance, string> {
    return reader.get(id)
  }
}

export function showDeposit(reader: Reader<Deposit, ID>) {
  return function (id: ID): AsyncResult<Deposit, string> {
    return reader.get(id)
  }
}

export function showAllDeposit(reader: Reader<Deposit, ID>) {
  return function (): AsyncResult<Deposit[], ID> {
    return reader.getAll()
  }
}

export function showAllBalance(reader: Reader<Balance, ID>) {
  return function (): AsyncResult<Balance[], string> {
    return reader.getAll()
  }
}

// event source this bitch
// just create and aggregate here
// then rebuild in each get?
export function createBalanceFactory(write: Writer<Balance>) {
  return function (cmd: BalanceCreateRequestBody): AsyncResult<Balance, string> {
    return write(Balance(cmd.balanceId, cmd.amount, new Date()) as Writable<Balance>)
  }
}

// Persist event first!! (after validation)
export function createDepositFactory(balanceReader: Reader<Balance, ID>, writer: WriterArray<[Balance, Deposit]>) {
  return function (cmd: DepositCreateRequestBody): AsyncResult<Deposit, string> {
    return balanceReader
      .get(cmd.balanceId)
      .then(ifOkApply(deposit(cmd.amount)))
      .then(ifOkApply(balance => [balance, newDeposit(cmd.balanceId, cmd.amount, new Date())]))
      .then(ifOkWriteTo(writer))
      .then(ifOkApply(([balance, deposit]) => deposit))
  }
}

export function createWithdrawlFactory(reader: Reader<Balance, ID>, writer: Writer<[Balance, Withdraw]>) {
  return function (cmd: WithdrawCreateRequestBody): AsyncResult<Withdraw, string> {
    return reader
      .get(cmd.balanceId)
      .then(ifOkAttempt(withdraw(cmd.amount)))
      .then(ifOkApply(balance => [balance, newWithdraw(cmd.balanceId, cmd.amount, new Date())]))
      .then(ifOkWriteTo(writer))
      .then(ifOkApply(([balance, withdrawl]) => withdrawl))
  }
}

export function createTransfer(reader: Reader<Balance, ID>, writer: Writer<[Balance, Balance, Transfer]>) {
  return function (cmd: TransferCreateRequestBody) {
    return reader
      .getMulti([cmd.senderBalanceId, cmd.receiverBalanceId])
      .then(ifOkAttempt(arrTransfer(cmd.amount)))
      .then(ifOkApply(balances => [...balances, newTransfer(cmd.senderBalanceId, cmd.receiverBalanceId, cmd.amount, new Date())]))
      .then(ifOkWriteTo(writer))
      .then(ifOkApply(data => data[2]))
  }
}

// HELPERS

function arrTransfer(amt: number) {
  return function (balances: Balance[]) {
    return balances.length < 2
      ? Result.err<Balance[], string>("Error retrieving balances")
      : transfer(amt)(balances[0])(balances[1])
  }
}


function ifOkWriteTo<T>(write: Writer<T>) {
  return asyncAndThen((item: T) => write(item as Writable<T>))
}


function asyncAndThen<T, U>(fn: (x: T) => Promise<Result<U, string>>) {
  return function (r: Result<T, string>) {
    return r.isErr()
      ? Result.err(r.unsafelyUnwrapErr()) as Result<U, string>
      : fn(r.unsafelyUnwrap())
  }
}

function ifOkApply<T, U>(fn: (x: T) => U) {
  return function (r: Result<T, string>) {
    return r.map(fn)
  }
}

function ifOkAttempt<T, U>(fn: (x: T) => Result<U, string>) {
  return function (r: Result<T, string>) {
    return r.andThen(fn)
  }
}
