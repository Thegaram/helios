import {useHistory} from 'react-router-dom'
import Dropdown from '@cfxjs/component-dropdown'
import {useTranslation} from 'react-i18next'
import {Languages} from '../constants'
import {ArrowDown, LeftArrow} from '@cfxjs/component-icons'
import PropTypes from 'prop-types'

const Overlay = changeLanguage => {
  const {t} = useTranslation()
  return (
    <>
      {Languages.map(lang => (
        <div
          className="cursor-pointer"
          aria-hidden="true"
          key={lang}
          onClick={changeLanguage}
        >
          {t(lang)}
        </div>
      ))}
    </>
  )
}

const LanguageNav = ({hasGoBack = false}) => {
  const history = useHistory()
  const {i18n, t} = useTranslation()
  const {language} = i18n
  const changeLanguage = () => {
    if (language.indexOf('en') !== -1) {
      i18n.changeLanguage('zh-CN')
    } else if (language.indexOf('zh') !== -1) {
      i18n.changeLanguage('en')
    }
  }

  return (
    <nav className="flex justify-between h-13 items-center text-white px-4">
      {hasGoBack ? (
        <div
          className="flex items-center cursor-pointer"
          aria-hidden="true"
          onClick={() => {
            history.goBack()
          }}
        >
          <LeftArrow className="mr-2" />
          <span className="text-sm">{t('back')}</span>
        </div>
      ) : (
        <div />
      )}
      <Dropdown overlay={Overlay(changeLanguage)} trigger={['hover']}>
        <div className="flex items-center">
          <span className="text-xs">{t(language)}</span>
          <ArrowDown className="ml-1" />
        </div>
      </Dropdown>
    </nav>
  )
}
LanguageNav.propTypes = {
  hasGoBack: PropTypes.bool,
}
export default LanguageNav
