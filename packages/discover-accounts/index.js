import {getNthAccountOfHDKey} from '@cfxjs/hdkey'
import {stripHexPrefix} from '@cfxjs/utils'
import BN from 'bn.js'
import {isFunction} from '@cfxjs/checks'

const ZERO = new BN(0, 10)

export const hasTx = async ({getTxCount, address}) => {
  let rst = false
  try {
    const res = await getTxCount([address])
    if (new BN(stripHexPrefix(res?.result ?? res), 16).gt(ZERO)) rst = true
  } catch (err) {} // eslint-disable-line no-empty

  return rst
}

export const hasBalance = async ({getBalance, address}) => {
  let rst = false
  try {
    const res = await getBalance([address])
    if (new BN(stripHexPrefix(res?.result ?? res), 16).gt(ZERO)) rst = true
  } catch (err) {} // eslint-disable-line no-empty

  return rst
}

export const discoverAccounts = async ({
  getBalance,
  getTxCount,
  mnemonic,
  hdPath,
  startFrom = 0,
  max = 10,
  only0x1Prefixed = false,
  return0 = false,
  onFindOne,
} = {}) => {
  const found = []
  for (let i = startFrom; i < startFrom + max; i++) {
    const rst = await getNthAccountOfHDKey({
      mnemonic,
      hdPath,
      nth: i,
      only0x1Prefixed,
    })

    const [txOk, balanceOk] = await Promise.all([
      hasTx({getTxCount, address: rst.address}),
      hasBalance({getBalance, address: rst.address}),
    ])

    // always return the first address
    // nth: the try times starts at 0
    if ((return0 && i === 0) || txOk || balanceOk) {
      if (isFunction(onFindOne)) await onFindOne({...rst, nth: i})
      found.push({...rst, nth: i})
    } else {
      return found
    }
  }

  return found
}