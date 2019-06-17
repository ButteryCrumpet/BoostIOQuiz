
import { deposit, Balance, withdraw, transfer } from "../../src/domain/balance"

const NO_FUNDS = Balance("id", 0, new Date())
const FUNDS = Balance("id", 50, new Date())

describe("balance module", () => {

  describe("deposit", () => {

    it ("correctly adds amount", () => {
      expect(deposit(5)(FUNDS)).toEqual({...FUNDS, amount: 55})
    })

  })

  describe("withdraw", () => {

    it("correctly withdraws amount", () => {
      const balance = withdraw(5)(FUNDS)
      expect(balance.isOk()).toBe(true)
      expect(balance.unsafelyUnwrap()).toEqual({...FUNDS, amount: 45})
    })

    it("it errors not enough funds", () => {
      const balance = withdraw(5)(NO_FUNDS)
      expect(balance.isErr()).toBe(true)
    })

  })

  describe("transfer", () => {

    it("correctly withdraws amount", () => {
      const balance = transfer(5)(FUNDS)({...FUNDS})
      expect(balance.isOk()).toBe(true)
      expect(balance.unsafelyUnwrap()).toEqual([{...FUNDS, amount: 45}, {...FUNDS, amount: 55}])
    })

    it("it errors not enough funds", () => {
      const balance = transfer(5)(NO_FUNDS)(FUNDS)
      expect(balance.isErr()).toBe(true)
    })

  })

})