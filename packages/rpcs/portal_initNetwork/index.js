/**
 * @fileOverview rpc defination of portal_initNetwork
 * @name index.js
 */

import {MAINNET, TESTNET, LOCALHOST} from 'consts'

export const NAME = 'portal_initNetwork'

// select testnet in dev, mainnet in prod, localhost in test
const DEFAULT_NETWORK = {
  development: TESTNET,
  test: LOCALHOST,
  production: MAINNET,
}[process.env.NODE_ENV]

const NETWORK_ENDPOINTS = {
  MAINNET: process.env.SNOWPACK_PUBLIC_MAINNET_RPC_ENDPOINT,
  TESTNET: process.env.SNOWPACK_PUBLIC_TESTNET_RPC_ENDPOINT,
  LOCALHOST: process.env.SNOWPACK_PUBLIC_LOCALHOST_RPC_ENDPOINT,
}

const BUILT_IN_NETWORKS = {
  [NETWORK_ENDPOINTS[MAINNET]]: {
    endpoints: NETWORK_ENDPOINTS[MAINNET],
    type: MAINNET,
    name: MAINNET,
  },
  [NETWORK_ENDPOINTS[TESTNET]]: {
    endpoints: NETWORK_ENDPOINTS[TESTNET],
    type: TESTNET,
    name: TESTNET,
  },
  [NETWORK_ENDPOINTS[LOCALHOST]]: {
    endpoints: NETWORK_ENDPOINTS[LOCALHOST],
    type: LOCALHOST,
    name: LOCALHOST,
  },
}

export function main({setState, getState}) {
  return async () => {
    const {
      networks: userNetworks,
      wallet_currentChainId,
      wallet_currentNetworkId,
    } = getState()
    const newNetworks = {...userNetworks, ...BUILT_IN_NETWORKS}
    // set built-in networks
    setState({networks: newNetworks})

    // set currentNetwork first to enable rpcs fetching network info
    const currentNetworkEndpoint = NETWORK_ENDPOINTS[DEFAULT_NETWORK]
    setState({currentNetworkEndpoint})

    const currentNetworkConfig = newNetworks[currentNetworkEndpoint]

    currentNetworkConfig.chainId = await wallet_currentChainId()
    currentNetworkConfig.networkId = await wallet_currentNetworkId()

    setState({
      networks: {
        ...newNetworks,
        [currentNetworkEndpoint]: currentNetworkConfig,
      },
    })
  }
}
