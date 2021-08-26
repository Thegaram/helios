import {nul, or, and, empty, arrp} from '@cfxjs/spec'

export const NAME = 'cfx_chainId'

export const schemas = {
  input: [or, nul, [and, arrp, empty]],
}

export const permissions = {
  external: ['popup', 'inpage'],
  locked: true,
  methods: ['cfx_getStatus'],
}

export const cache = {
  type: 'ttl',
  ttl: 24 * 60 * 60 * 1000,
  key: () => NAME,
  afterGet(_, c) {
    if (!c) return 'nocache'
  },
}

export const main = async ({f, rpcs: {cfx_getStatus}}) => {
  const rst = await f()
  if (rst?.result === 'nocache') return (await cfx_getStatus())?.chainId
  return rst.result
}