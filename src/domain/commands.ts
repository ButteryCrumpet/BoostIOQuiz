export interface BalanceCreateRequestBody {
  balanceId: string | number
  amount: number
}

export interface DepositCreateRequestBody {
  balanceId: string | number
  amount: number
}

export interface WithdrawCreateRequestBody {
  balanceId: number | string
  amount: number
}

export interface TransferCreateRequestBody {
  senderBalanceId: number | string
  receiverBalanceId: number | string
  amount: number
}