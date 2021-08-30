import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import {LanguageNav, HomeTitle} from '../../components'
import Button from '@cfxjs/component-button'

const Welcome = () => {
  const {t} = useTranslation()
  const history = useHistory()
  return (
    <div className="bg-blue-700 h-full">
      <LanguageNav hasGoBack={false} />
      <header>
        <HomeTitle title={t('hello')} subTitle={t('welcome')} />
      </header>

      <main>
        <Button
          fullWidth
          onClick={() => {
            history.push('/set-password')
          }}
        >
          {t('create')}
        </Button>
      </main>
    </div>
  )
}

export default Welcome
