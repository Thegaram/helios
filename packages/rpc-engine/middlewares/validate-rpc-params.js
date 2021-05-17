import {defMiddleware} from '../middleware.js'
import {validate, explain} from '@cfxjs/spec'

export default defMiddleware(({tx: {map}}) => ({
  id: 'validateRpcParams',
  ins: {
    req: {stream: '/injectWalletDB/node'},
  },
  fn: map(({rpcStore, req}) => {
    const {params, method} = req
    const {schemas, Err} = rpcStore[method]
    if (schemas.input && !validate(schemas.input, params)) {
      // TODO: make error message more readable
      throw Err.InvalidParams(
        `input params:\n${JSON.stringify(
          params,
          null,
          '\t',
        )}\n\nError:\n${JSON.stringify(
          explain(schemas.input, params),
          null,
          '\t',
        )}`,
        req,
      )
    }

    return req
  }),
}))