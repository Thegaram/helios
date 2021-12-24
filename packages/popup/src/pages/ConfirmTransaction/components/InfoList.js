import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import {EditOutlined} from '@fluent-wallet/component-icons'
import {useCurrentDapp, useCurrentAddress} from '../../../hooks/useApi'
import {DisplayBalance} from '../../../components'
import useGlobalStore from '../../../stores'
import {ROUTES} from '../../../constants'
const {EDIT_PERMISSION} = ROUTES

// TODO: use network id
const CurrentNetworkDisplay = ({currentNetwork}) => {
  const {name, icon} = currentNetwork

  return (
    <div className="flex items-center">
      <img
        className="w-4 h-4 mr-1"
        src={icon || '/images/default-network-icon.svg'}
        alt="logo"
      />
      <span className="text-gray-80 mr-1">{name}</span>
    </div>
  )
}

CurrentNetworkDisplay.propTypes = {
  currentNetwork: PropTypes.object,
}

function InfoList({
  isDapp,
  isApproveToken,
  isSign,
  token,
  allowance,
  method,
  pendingAuthReq,
}) {
  const {t} = useTranslation()
  const history = useHistory()
  const data = useCurrentDapp()
  const {
    data: {network},
  } = useCurrentAddress()
  const {customAllowance} = useGlobalStore()
  const [{app}] = pendingAuthReq?.length ? pendingAuthReq : [{}]
  const currentDapp = isDapp ? app : data?.app
  const currentNetwork = isDapp ? app?.currentNetwork : network
  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-4">
        <span className="text-gray-40">{t('network')}</span>
        <CurrentNetworkDisplay currentNetwork={currentNetwork} />
      </div>
      {isApproveToken && (
        <div className="flex justify-between mb-4">
          <span className="text-gray-40">{t('allowLimit')}</span>
          <span className="flex items-center">
            <DisplayBalance
              id="allowance"
              balance={customAllowance || allowance}
              maxWidth={240}
              maxWidthStyle="max-w-[240px]"
              symbol={token?.symbol}
            />
            <EditOutlined
              className="w-4 h-4 ml-1 cursor-pointer"
              id="editAllowance"
              onClick={() => history.push(EDIT_PERMISSION)}
            />
          </span>
        </div>
      )}
      {isSign && (
        <div className="flex justify-between mb-4">
          <span className="text-gray-40">{t('action')}</span>
          <span className="text-gray-80" id="methodName">
            {method}
          </span>
        </div>
      )}
      {isDapp && (
        <div className="flex justify-between mb-4">
          <span className="text-gray-40">{t('protocol')}</span>
          <span className="text-gray-80 flex items-center" id="currentDapp">
            <img
              src={currentDapp?.site?.icon || '/images/default-dapp-icon.svg'}
              alt="icon"
              className="w-4 h-4 mr-1"
              id="currentDappIcon"
            />
            {currentDapp?.site?.origin}
          </span>
        </div>
      )}
    </div>
  )
}

InfoList.propTypes = {
  isApproveToken: PropTypes.bool,
  isSign: PropTypes.bool,
  token: PropTypes.object,
  isDapp: PropTypes.bool,
  allowance: PropTypes.string,
  method: PropTypes.string,
  pendingAuthReq: PropTypes.array,
}

export default InfoList
