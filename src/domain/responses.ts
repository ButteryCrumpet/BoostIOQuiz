import { Balance, Deposit, Withdraw, Transfer } from "./balance"

export interface BalanceCreateResponseBody {
  balance: Balance
}

export interface BalanceShowResponseBody {
  balance: Balance
}

export interface DepositCreateResponseBody {
  deposit: Deposit
}

export interface DepositListResponseBody {
  deposits: Deposit[]
}

export interface DepositShowResponseBody {
  deposit: Deposit
}

export interface WithdrawShowResponseBody {
  withdrawl: Withdraw
}

export interface TransferShowResponseBody {
  transfer: Transfer
}