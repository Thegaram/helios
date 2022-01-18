import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {isNumber} from '@fluent-wallet/checks'
import Message from '@fluent-wallet/component-message'
import {RPC_METHODS} from '../../../constants'
import {AccountItem} from './'
const {WALLET_EXPORT_ACCOUNT_GROUP, WALLET_DELETE_ACCOUNT_GROUP} = RPC_METHODS

function GroupItem({
  nickname,
  account,
  currentAccountId,
  showDelete = false,
  groupType = '',
  onOpenConfirmPassword,
  accountGroupId,
}) {
  const {t} = useTranslation()
  const onDeleteAccountGroup = () => {
    if (isNumber(currentAccountId)) {
      if (account.find(({eid}) => eid === currentAccountId)) {
        return Message.warning({
          content: t('groupDeleteWarning'),
          top: '10px',
          duration: 1,
        })
      }
      onOpenConfirmPassword?.(WALLET_DELETE_ACCOUNT_GROUP, {
        accountGroupId,
      })
    }
  }

  return (
    <div className="bg-gray-0 rounded mt-3 mx-3">
      {groupType === 'pk' ? null : (
        <p className="text-gray-40 ml-4 mb-1 text-xs pt-3">{nickname}</p>
      )}
      {account.map(({nickname, eid}) => (
        <AccountItem
          key={eid}
          accountId={eid}
          accountGroupId={accountGroupId}
          accountNickname={nickname}
          groupType={groupType}
          showDelete={showDelete}
          onOpenConfirmPassword={onOpenConfirmPassword}
        />
      ))}
      {groupType === 'hd' ? (
        <div className="flex justify-between mx-3 py-4 border-t border-gray-10 text-xs cursor-pointer text-gray-60">
          <div
            className="hover:text-primary"
            onClick={() =>
              onOpenConfirmPassword?.(WALLET_EXPORT_ACCOUNT_GROUP, {
                accountGroupId,
              })
            }
            aria-hidden="true"
          >
            {t('viewSeed')}
          </div>
          {showDelete && (
            <div
              aria-hidden="true"
              className="hover:text-primary"
              onClick={onDeleteAccountGroup}
            >
              {t('delete')}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

GroupItem.propTypes = {
  nickname: PropTypes.string,
  accountGroupId: PropTypes.number,
  currentAccountId: PropTypes.number,
  account: PropTypes.array,
  groupType: PropTypes.string,
  showDelete: PropTypes.bool,
  onOpenConfirmPassword: PropTypes.func,
}

export default GroupItem