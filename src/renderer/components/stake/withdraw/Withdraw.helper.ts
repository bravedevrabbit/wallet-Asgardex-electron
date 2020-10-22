import { AssetAmount, baseAmount, baseToAsset, bn } from '@thorchain/asgardex-util'
import BigNumber from 'bignumber.js'

export const getWithdrawAmountsFactory = (
  poolUnits: BigNumber,
  totalRuneInPool: BigNumber,
  totalAssetInPool: BigNumber,
  stakeUnits: BigNumber
) => {
  const runeShare = poolUnits ? totalRuneInPool.multipliedBy(stakeUnits).div(poolUnits) : bn(0)
  const assetShare = poolUnits ? totalAssetInPool.multipliedBy(stakeUnits).div(poolUnits) : bn(0)

  return (percentAmount: number): { runeWithdraw: AssetAmount; assetWithdraw: AssetAmount } => {
    const percentBn = bn(percentAmount / 100)
    const runeBaseAmount = baseAmount(percentBn.multipliedBy(runeShare))
    const assetBaseAmount = baseAmount(percentBn.multipliedBy(assetShare))

    return {
      runeWithdraw: baseToAsset(runeBaseAmount),
      assetWithdraw: baseToAsset(assetBaseAmount)
    }
  }
}
