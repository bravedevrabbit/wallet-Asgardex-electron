import React, { createContext, useContext } from 'react'

import { useSubscription } from 'observable-hooks'

import {
  subscribeTransfers,
  miniTickers$,
  reloadBalances,
  balancesState$,
  setKeystoreState,
  client$,
  clientViewState$,
  setNetworkState,
  address$,
  setSelectedAsset,
  txsSelectedAsset$,
  selectedAsset$,
  loadTxsSelectedAsset,
  explorerUrl$,
  transaction,
  freeze,
  transferFees$,
  freezeFee$
} from '../services/binance/service'
import { useAppContext } from './AppContext'
import { useWalletContext } from './WalletContext'

export type BinanceContextValue = {
  subscribeTransfers: typeof subscribeTransfers
  miniTickers$: typeof miniTickers$
  clientViewState$: typeof clientViewState$
  reloadBalances: typeof reloadBalances
  balancesState$: typeof balancesState$
  setSelectedAsset: typeof setSelectedAsset
  txsSelectedAsset$: typeof txsSelectedAsset$
  loadTxsSelectedAsset: typeof loadTxsSelectedAsset
  selectedAsset$: typeof selectedAsset$
  address$: typeof address$
  explorerUrl$: typeof explorerUrl$
  transaction: typeof transaction
  freeze: typeof freeze
  client$: typeof client$
  transferFees$: typeof transferFees$
  freezeFee$: typeof freezeFee$
}

const initialContext: BinanceContextValue = {
  subscribeTransfers,
  miniTickers$,
  client$,
  clientViewState$,
  reloadBalances,
  balancesState$,
  setSelectedAsset,
  txsSelectedAsset$,
  loadTxsSelectedAsset,
  selectedAsset$,
  address$,
  explorerUrl$,
  transaction,
  freeze,
  transferFees$,
  freezeFee$
}

const BinanceContext = createContext<BinanceContextValue | null>(null)

type Props = {
  children: React.ReactNode
}

export const BinanceProvider: React.FC<Props> = ({ children }: Props): JSX.Element => {
  const { keystoreService } = useWalletContext()
  const { network$ } = useAppContext()
  // Note: Service does need to subscribe to latest state of keystore and network!
  useSubscription(network$, (network) => setNetworkState(network))
  useSubscription(keystoreService.keystore$, (keystore) => setKeystoreState(keystore))

  return <BinanceContext.Provider value={initialContext}>{children}</BinanceContext.Provider>
}

export const useBinanceContext = () => {
  const context = useContext(BinanceContext)
  if (!context) {
    throw new Error('Context must be used within a BinanceProvider.')
  }
  return context
}
