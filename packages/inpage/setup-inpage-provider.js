import {rpcStream} from '@fluent-wallet/extension-runtime/rpc-stream.js'
import {initProvider} from '@fluent-wallet/provider-api'
import {takeOver} from './take-over-portal'

let PROVIDER = null

function validateMessage(e) {
  if (e.origin !== location.origin) return
  if (e.source !== window) return
  if (!e.data) return
  if (!e.data.__fromFluentContentScript) return
  if (typeof e.data.msg !== 'object') return
  if (e.data.msg.event) return true
  if (!e.data.msg.id && e.data.msg.id !== 0) return
  if (!e.data.msg.error && e.data.msg.result === undefined) return
  if (e.data.msg.error && (!e.data.msg.error.message || !e.data.msg.error.code))
    return

  return true
}

const FLUENT_BACKEND_PREFERENCES = '__FLUENT_BACKEND_PREFERENCES__'
const FLUENT_USE_MODERN_PROVIDER_API = '__FLUENT_USE_MODERN_PROVIDER_API__'
const FLUENT_OVERRIDE_WINDOW_DOT_CONFLUX =
  '__FLUENT_OVERRIDE_WINDOW_DOT_CONFLUX__'
const FLUENT_OVERRIDE_WINDOW_DOT_ETHEREUM =
  '__FLUENT_OVERRIDE_WINDOW_DOT_ETHEREUM__'

function maybeUseModernProviderAPI(useModernProviderAPI) {
  if (useModernProviderAPI) {
    if (window.localStorage.getItem(FLUENT_USE_MODERN_PROVIDER_API)) return
    window.localStorage.setItem(FLUENT_USE_MODERN_PROVIDER_API, true)
    window.location.reload()
  } else {
    if (!window.localStorage.getItem(FLUENT_USE_MODERN_PROVIDER_API)) return
    window.localStorage.removeItem(FLUENT_USE_MODERN_PROVIDER_API)
    window.location.reload()
  }
}

function maybeOverrideWindowDotConflux(overrideWindowDotConflux) {
  if (overrideWindowDotConflux) {
    if (
      window.localStorage.getItem(FLUENT_OVERRIDE_WINDOW_DOT_CONFLUX) === false
    ) {
      window.localStorage.removeItem(FLUENT_OVERRIDE_WINDOW_DOT_CONFLUX)
      window.location.reload()
    }
  } else {
    if (
      window.localStorage.getItem(FLUENT_OVERRIDE_WINDOW_DOT_CONFLUX) === false
    )
      return
    window.localStorage.setItem(FLUENT_OVERRIDE_WINDOW_DOT_CONFLUX, false)
    window.location.reload()
  }
}

function maybeOverrideWindowDotEthereum(overrideWindowDotEthereum) {
  if (overrideWindowDotEthereum) {
    if (!window.localStorage.getItem(FLUENT_OVERRIDE_WINDOW_DOT_ETHEREUM)) {
      window.localStorage.setItem(FLUENT_OVERRIDE_WINDOW_DOT_ETHEREUM, true)
      window.location.reload()
    }
  } else {
    if (!window.localStorage.getItem(FLUENT_OVERRIDE_WINDOW_DOT_ETHEREUM))
      return

    window.localStorage.removeItem(FLUENT_OVERRIDE_WINDOW_DOT_ETHEREUM)
    window.location.reload()
  }
}

function setupProvider() {
  if (PROVIDER) return
  let sameOriginListener = () => {}
  window.addEventListener('message', e => {
    if (!validateMessage(e)) return

    if (e.data.msg.event === FLUENT_BACKEND_PREFERENCES) {
      maybeUseModernProviderAPI(e.data.msg.params.useModernProviderAPI)
      maybeOverrideWindowDotConflux(e.data.msg.params.overrideWindowDotConflux)
      maybeOverrideWindowDotEthereum(
        e.data.msg.params.overrideWindowDotEthereum,
      )

      return
    }

    sameOriginListener(e.data.msg)
  })

  const post = msg =>
    window.postMessage(
      {
        __fromFluentInpage: true,
        msg,
      },
      location.origin,
    )

  const {send: sendToBg, stream} = rpcStream({
    postMessage: post,
    onMessage: {
      addListener(f) {
        sameOriginListener = f
      },
    },
  })

  PROVIDER = initProvider(
    stream,
    sendToBg,
    Boolean(window.localStorage.getItem(FLUENT_USE_MODERN_PROVIDER_API)),
  )

  window.conflux = PROVIDER
  window.confluxJS = PROVIDER.confluxJS

  if (
    !(window.localStorage.getItem(FLUENT_OVERRIDE_WINDOW_DOT_CONFLUX) === false)
  ) {
    window.conflux = PROVIDER
    window.confluxJS = PROVIDER.confluxJS
    takeOver(PROVIDER, 'cfx')
  }
  if (window.localStorage.getItem(FLUENT_OVERRIDE_WINDOW_DOT_ETHEREUM)) {
    window.ethereum = PROVIDER
    takeOver(PROVIDER, 'eth')
  }
  return PROVIDER
}

setupProvider()
