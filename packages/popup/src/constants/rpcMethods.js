export const GET_ACCOUNT_GROUP = 'wallet_getAccountGroup'
export const GET_PENDING_AUTH_REQ = 'wallet_getPendingAuthRequest'
export const REJECT_PENDING_AUTH_REQ = 'wallet_userRejectedAuthRequest'
export const APPROVE_PENDING_AUTH_REQ = 'wallet_userApprovedAuthRequest'
export const ACCOUNT_GROUP_TYPE = {
  HD: 'hd',
  PK: 'pk',
}
export const GET_WALLET_LOCKED_STATUS = 'wallet_isLocked'
export const GET_CURRENT_NETWORK = 'wallet_getCurrentNetwork'
export const GET_CURRENT_ACCOUNT = 'wallet_getCurrentAccount'
export const GET_CURRENT_DAPP = 'wallet_getCurrentViewingApp'
export const GET_ACCOUNT_ADDRESS_BY_NETWORK =
  'wallet_getAccountAddressByNetwork'
export const GET_NO_GROUP = 'wallet_zeroAccountGroup'
export const GENERATE_MNEMONIC = 'wallet_generateMnemonic'
export const IMPORT_MNEMONIC = 'wallet_importMnemonic'
export const IMPORT_PRIVATE_KEY = 'wallet_importPrivateKey'
export const VALIDATE_MNEMONIC = 'wallet_validateMnemonic'
export const VALIDATE_PRIVATE_KEY = 'wallet_validatePrivateKey'
export const CREATE_ACCOUNT = 'wallet_createAccount'
export const UNLOCK = 'wallet_unlock'
export const LOCK = 'wallet_lock'
export const GET_NETWORK = 'wallet_getNetwork'
export const GET_BALANCE = 'wallet_getBalance'
export const SET_CURRENT_NETWORK = 'wallet_setCurrentNetwork'
export const SET_CURRENT_ACCOUNT = 'wallet_setCurrentAccount'
export const REQUEST_PERMISSIONS = 'wallet_requestPermissions'
export const DELETE_APP = 'wallet_deleteApp'
export const WALLET_SWITCH_CONFLUX_CHAIN = 'wallet_switchConfluxChain'
export const WALLET_SWITCH_ETHEREUM_CHAIN = 'wallet_switchEthereumChain'
export const CFX_SIGN_TYPED_DATA_V4 = 'cfx_signTypedData_v4'
export const ETH_SIGN_TYPED_DATA_V4 = 'eth_signTypedData_v4'
export const WALLET_ADD_ETHEREUM_CHAIN = 'wallet_addEthereumChain'
export const WALLET_ADD_CONFLUX_CHAIN = 'wallet_addConfluxChain'
export const WALLET_WATCH_ASSET = 'wallet_watchAsset'
export const GET_HOME_TOKEN_LIST = 'walletdb_homePageAssets'
export const REFETCH_BALANCE = 'wallet_refetchBalance'
