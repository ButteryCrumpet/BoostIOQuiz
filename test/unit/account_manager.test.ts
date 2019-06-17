import * as mockdate from "jest-date-mock"

import { createBalanceFactory, createDepositFactory, createWithdrawlFactory } from "../../src/domain/account_manager"
import { Result } from "true-myth";
import { Writer, Reader } from "../../src/io/types";
import { Balance, Deposit } from "../../src/domain/balance";


const TEST_BALANCE = Balance("id", 50, new Date("1995-12-17T03:24:00"))
const TEST_DEPOSIT = { id: "id", amount: 50, balanceId: "bid", createdAt: new Date("1995-12-17T03:24:00") }
const TEST_WITHDRAW = { id: "id", amount: 50, balanceId: "bid", createdAt: new Date("1995-12-17T03:24:00") }
const STATIC_DATE = new Date("1995-12-17T03:24:00");

mockdate.advanceTo(STATIC_DATE);

function writeFactoryOk<T>(fn: (items: T) => T): Writer<T> {
  return input => Promise.resolve(Result.ok(fn(input)))
}

function writeFactoryErr<T>(msg: string): Writer<T> {
  return items => Promise.resolve(new Result.Err(msg) as Result<T, string>)
}

function readFactoryOk<T, U> (item: T): Reader<T, U> {
  return {
      get: (id) => Promise.resolve(new Result.Ok(item)),
      getMulti: (ids) => Promise.resolve(new Result.Ok([item])),
      getAll: () => Promise.resolve(new Result.Ok([item])),
  }
}

function readFactoryErr<T, U> (msg: string): Reader<T, U> {
  return {
      get: (id) => Promise.resolve(new Result.Err(msg)),
      getMulti: (ids) => Promise.resolve(new Result.Err(msg)),
      getAll: () => Promise.resolve(new Result.Err(msg))
  }
}

describe("account manager", () => {

  describe("create balance", () => {
    it("returns balance from repository", done => {
      const run = createBalanceFactory(writeFactoryOk<Balance>((item) => item))
      run({balanceId: "echo", amount: 25})
        .then(result => {
          expect(result.isOk()).toBe(true)
          expect(result.unsafelyUnwrap()).toEqual({createdAt: STATIC_DATE, id: "echo", amount: 25})
          done()
        })
    })

    it("returns error on repo failure", done => {
      const run = createBalanceFactory(writeFactoryErr<Balance>("write failure"))
      run({balanceId: "echo", amount: 25})
        .then(result => {
          expect(result.isErr()).toBe(true)
          expect(result.unsafelyUnwrapErr()).toEqual("write failure")
          done()
        })
    })
  })

  describe("create deposit", () => {

    const TEST_CREATE_DEPOSIT = { balanceId: "bid", amount: 30 }

    it("returns created deposit", done => {
      const run = createDepositFactory(readFactoryOk(TEST_BALANCE), writeFactoryOk(items => [items[0], {...items[1], id: "id"}]))
      run(TEST_CREATE_DEPOSIT)
        .then(result => {
          expect(result.isOk()).toBe(true)
          expect(result.unsafelyUnwrap()).toEqual({...TEST_CREATE_DEPOSIT, id: "id", createdAt: STATIC_DATE})
          done()
        })
    })

    it("fails with correct error on balance get failure", done => {
      const run = createDepositFactory(readFactoryErr("balance read failure"), writeFactoryOk(items => items))
      run(TEST_CREATE_DEPOSIT)
        .then(result => {
          expect(result.isErr()).toBe(true)
          expect(result.unsafelyUnwrapErr()).toEqual("balance read failure")
          done()
        })
    })

    it("fails with correct error on write failure", done => {
      const run = createDepositFactory(readFactoryOk(TEST_BALANCE), writeFactoryErr("write failure"))
      run(TEST_CREATE_DEPOSIT)
        .then(result => {
          expect(result.isErr()).toBe(true)
          expect(result.unsafelyUnwrapErr()).toEqual("write failure")
          done()
        })
    })
  })

  describe("create withdrawl", () => {

    const TEST_CREATE_WITHDRAWL = { balanceId: "bid", amount: 30 }

    it("returns created withdrawl", done => {
      const run = createWithdrawlFactory(readFactoryOk(TEST_WITHDRAW), writeFactoryOk(items => [items[0], {...items[1], id: "id"}]))
      run(TEST_CREATE_WITHDRAWL)
        .then(result => {
          expect(result.isOk()).toBe(true)
          expect(result.unsafelyUnwrap()).toEqual({...TEST_CREATE_WITHDRAWL, id: "id", createdAt: STATIC_DATE})
          done()
        })
    })

    it("fails with correct error on balance get failure", done => {
      const run = createWithdrawlFactory(readFactoryErr("balance read failure"), writeFactoryOk(items => items))
      run(TEST_CREATE_WITHDRAWL)
        .then(result => {
          expect(result.isErr()).toBe(true)
          expect(result.unsafelyUnwrapErr()).toEqual("balance read failure")
          done()
        })
    })

    it("fails with correct error on balance persist failure", done => {
      const run = createWithdrawlFactory(readFactoryOk(TEST_BALANCE), writeFactoryErr("write failure"))
      run(TEST_CREATE_WITHDRAWL)
        .then(result => {
          expect(result.isErr()).toBe(true)
          expect(result.unsafelyUnwrapErr()).toEqual("write failure")
          done()
        })
    })
  })

})