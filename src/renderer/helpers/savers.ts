import { getValueOfAsset1InAsset2, PoolData } from '@thorchain/asgardex-util'
import { assetFromString, BaseAmount, baseAmount, bnOrZero } from '@xchainjs/xchain-util'
import * as A from 'fp-ts/lib/Array'
import * as FP from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as Ord from 'fp-ts/lib/Ord'

import { PoolsWatchList } from '../../shared/api/io'
import { Network } from '../../shared/api/types'
import type { PoolDetails } from '../services/midgard/types'
import { toPoolData } from '../services/midgard/utils'
import { PoolDetail } from '../types/generated/midgard'
import type { SaversTableRowData, SaversTableRowsData } from '../views/savers/Savers.types'
import { eqAsset, eqString } from './fp/eq'
import { ordBaseAmount } from './fp/ord'
import { sequenceTOption, sequenceTOptionFromArray } from './fpHelpers'
import { getDeepestPoolSymbol } from './poolHelper'

/**
 * Order savers by depth price
 */
export const ordSaversByDepth = Ord.Contravariant.contramap(
  ordBaseAmount,
  ({ depthPrice }: { depthPrice: BaseAmount }) => depthPrice
)

export const getSaversTableRowData = ({
  poolDetail,
  pricePoolData,
  watchlist,
  maxSynthPerPoolDepth,
  network
}: {
  poolDetail: PoolDetail
  pricePoolData: PoolData
  watchlist: PoolsWatchList
  maxSynthPerPoolDepth: number
  network: Network
}): O.Option<SaversTableRowData> => {
  return FP.pipe(
    poolDetail.asset,
    assetFromString,
    O.fromNullable,
    O.map((poolDetailAsset) => {
      const poolData = toPoolData(poolDetail)
      const depthAmount = baseAmount(poolDetail.saversDepth)
      const depthPrice = getValueOfAsset1InAsset2(depthAmount, poolData, pricePoolData)
      const apr = bnOrZero(poolDetail.saversAPR).times(100)

      const maxPercent = bnOrZero(maxSynthPerPoolDepth).div(100)
      // saverCap = assetDepth * 2 * maxPercent / 100
      const saverCap = bnOrZero(poolDetail.assetDepth).times(2).times(maxPercent).div(100)
      // filled = saversDepth * 100 / saverCap
      const filled = bnOrZero(poolDetail.saversDepth).times(100).div(saverCap)

      const watched: boolean = FP.pipe(
        watchlist,
        A.findFirst((poolInList) => eqAsset.equals(poolInList, poolDetailAsset)),
        O.isSome
      )

      return {
        asset: poolDetailAsset,
        depth: depthAmount,
        depthPrice,
        filled,
        key: poolDetailAsset.ticker,
        network,
        apr,
        watched
      }
    })
  )
}

export const getSaversTableRowsData = ({
  poolDetails,
  pricePoolData,
  watchlist,
  maxSynthPerPoolDepth,
  network
}: {
  poolDetails: PoolDetails
  pricePoolData: PoolData
  watchlist: PoolsWatchList
  maxSynthPerPoolDepth: number
  network: Network
}): SaversTableRowsData => {
  // get symbol of deepest pool
  const oDeepestPoolSymbol: O.Option<string> = getDeepestPoolSymbol(poolDetails)

  // Transform `PoolDetails` -> SaversTableRowData
  return FP.pipe(
    poolDetails,
    A.mapWithIndex<PoolDetail, O.Option<SaversTableRowData>>((index, poolDetail) => {
      // get symbol of PoolDetail
      const oPoolDetailSymbol: O.Option<string> = FP.pipe(
        O.fromNullable(assetFromString(poolDetail.asset ?? '')),
        O.map(({ symbol }) => symbol)
      )
      // compare symbols to set deepest pool
      const deepest = FP.pipe(
        sequenceTOption(oDeepestPoolSymbol, oPoolDetailSymbol),
        O.fold(
          () => false,
          ([deepestPoolSymbol, poolDetailSymbol]) => eqString.equals(deepestPoolSymbol, poolDetailSymbol)
        )
      )

      return FP.pipe(
        getSaversTableRowData({ poolDetail, pricePoolData, watchlist, maxSynthPerPoolDepth, network }),
        O.map(
          (poolTableRowData) =>
            ({
              ...poolTableRowData,
              key: poolDetail?.asset || index.toString(),
              deepest
            } as SaversTableRowData)
        )
      )
    }),
    sequenceTOptionFromArray,
    O.getOrElse(() => [] as SaversTableRowsData),
    // Table does not accept `defaultSortOrder` for depth  for any reason,
    // that's why we sort depth here
    A.sortBy([ordSaversByDepth]),
    // descending sort
    A.reverse
  )
}
