import { network$ } from '../app/service'
import {
  balances$,
  balancesConfirmed$,
  reloadBalances,
  getBalanceByAddress$,
  getBalanceConfirmedByAddress$,
  reloadBalances$,
  resetReloadBalances
} from './balances'
import { client$, clientState$, address$, addressUI$, explorerUrl$ } from './common'
import { createFeesService } from './fees'
import { createLedgerService } from './ledger'
import { createTransactionService } from './transaction'

const { subscribeTx, txRD$, resetTx, sendTx, txs$, tx$, txStatus$ } = createTransactionService(client$, network$)
const { fees$, reloadFees, feesWithRates$, reloadFeesWithRates } = createFeesService(client$)
const { ledgerAddress$, retrieveLedgerAddress, removeLedgerAddress, pushLedgerTx, ledgerTxRD$, resetLedgerTx } =
  createLedgerService()

export {
  client$,
  clientState$,
  explorerUrl$,
  address$,
  addressUI$,
  reloadBalances,
  reloadBalances$,
  resetReloadBalances,
  balances$,
  balancesConfirmed$,
  getBalanceByAddress$,
  getBalanceConfirmedByAddress$,
  reloadFees,
  fees$,
  reloadFeesWithRates,
  feesWithRates$,
  subscribeTx,
  sendTx,
  txRD$,
  resetTx,
  txs$,
  tx$,
  txStatus$,
  ledgerAddress$,
  retrieveLedgerAddress,
  removeLedgerAddress,
  pushLedgerTx,
  ledgerTxRD$,
  resetLedgerTx
}
