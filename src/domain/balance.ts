import { Writable } from "../io/types";
import { Result } from "true-myth";

// remove .id & .createdAt from Deposit Withdraw Transfer as it is a persitence implementation feature
// Balance.id is required for domain logic
export type ID = number | string


export interface Balance {
  id: ID
  amount: number
  createdAt: Date
}

export interface Deposit {
  id: ID,
  balanceId: ID
  amount: number
  createdAt: Date
}

export interface Withdraw {
  id: ID,
  balanceId: ID
  amount: number
  createdAt: Date
}

export interface Transfer {
  id: ID,
  senderBalanceId: ID
  receiverBalanceId: ID
  amount: number
  createdAt: Date
}

export function Balance(id: ID, amount: number, createdAt: Date): Balance {
  return { id, amount, createdAt }
}

export function newDeposit(balanceId: ID, amount: number, createdAt: Date): Writable<Deposit> {
  return { balanceId, amount, createdAt, id: null }
}

export function newWithdraw(balanceId: ID, amount: number, createdAt: Date): Writable<Withdraw> {
  return { balanceId, amount, createdAt, id: null }
}

export function newTransfer(senderBalanceId: ID, receiverBalanceId: ID, amount: number, createdAt: Date): Writable<Transfer> {
  return { senderBalanceId, receiverBalanceId, amount, createdAt, id: null }
}

export function deposit(amount: number) {
  return function (balance: Balance): Balance {
    return { ...balance, amount: balance.amount + amount }
  }
}

export function withdraw(amount: number) {
  return function (balance: Balance): Result<Balance, string> {
    return balance.amount - amount >= 0
      ? Result.ok({ ...balance, amount: balance.amount - amount })
      : Result.err("not enough funds")
  }
}

export function transfer(amount: number) {
  return function (senderBalance: Balance) {
    return function (recieverBalance: Balance): Result<Balance[], string> {
      return senderBalance.amount - amount >= 0
        ? Result.ok([
          { ...senderBalance, amount: senderBalance.amount - amount },
          { ...recieverBalance, amount: recieverBalance.amount + amount }
        ])
        : Result.err("no enough funds in sender account")
    }
  }
}
