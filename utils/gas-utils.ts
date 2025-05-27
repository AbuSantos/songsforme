import { type FeeData } from 'viem' // Replace 'FeeData' with the correct type exported by 'viem'
// Replace 'SomeCorrectType' with the actual type exported by 'viem' that matches your usage.

export const getOptimizedGasConfig = async (feeData: FeeData) => {
  if (!feeData) return {}

  // For EIP-1559 compatible networks
  if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
    return {
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    }
  }

  // For legacy networks
  return {
    gasPrice: feeData.gasPrice,
  }
}