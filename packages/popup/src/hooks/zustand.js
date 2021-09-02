import create from 'zustand'
import {useTranslation} from 'react-i18next'
import {useRPC} from '@cfxjs/use-rpc'
import {useRef, useEffect} from 'react'
import {isFunction} from '@cfxjs/checks'

const globalThis = window ?? global

const createUseRPCHook =
  ({deps, params, opts = {}, key, get, set} = {}) =>
  () => {
    const stateDepsRef = useRef({
      data: false,
      error: false,
      isValidating: false,
    })

    const rst = useRPC(deps, params, opts)

    const getNewRst = {
      [`${key}Mutate`]: rst.mutate,
      get [`${key}Data`]() {
        stateDepsRef.current.data = true
        return rst.data
      },
      get [`${key}Error`]() {
        stateDepsRef.current.error = true
        return rst.error
      },
      get [`${key}IsValidating`]() {
        stateDepsRef.current.isValidating = true
        return rst.isValidating
      },
    }

    useEffect(() => {
      const beforeSetFn = get()[`${key}BeforeSet`]
      set({[key]: beforeSetFn ? beforeSetFn(getNewRst) : getNewRst})
      get()[`${key}AfterSet`]?.(get().group)
    }, [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      stateDepsRef.current.data && rst.data,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      stateDepsRef.current.error && rst.error,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      stateDepsRef.current.isValidating && rst.isValidating,
    ])
  }

const createWithUseRPC = (...args) => {
  let createStateArg = () => ({})
  let rpcConfig = {}

  if (args.length === 1 && isFunction(args[0])) createStateArg = args[0]
  else if (args.length === 1 && !isFunction(args[0])) rpcConfig = args[0]
  else if (args.length >= 2) {
    createStateArg = args[0]
    rpcConfig = args[1]
  }

  const useStore = create((set, get) =>
    Object.keys(rpcConfig).reduce(
      (acc, key) => {
        if (!acc.__hooksToRun) acc.__hooksToRun = []
        const {deps, params, opts} = rpcConfig[key]
        acc.__hooksToRun.push(
          createUseRPCHook({
            key,
            deps,
            params,
            opts,
            set,
            get,
          }),
        )

        acc[key] = {
          [`${key}Data`]: opts?.fallbackData,
        }

        return acc
      },
      {
        ...createStateArg(set, get),
        r: (...args) => globalThis.___CFXJS_USE_RPC__PRIVIDER?.request(...args),
      },
    ),
  )

  return (...args) => {
    const {t} = useTranslation()
    const s = useStore(...args)
    s.__hooksToRun.forEach(fn => fn())
    s.t = t
    return s
  }
}

export default createWithUseRPC