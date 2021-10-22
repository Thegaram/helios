import {or, optParam, enums, map, truep} from '@fluent-wallet/spec'

export const NAME = 'wallet_refetchBalance'

export const schemas = {
  input: [
    or,
    optParam,
    [
      map,
      {closed: true},
      [
        'type',
        {
          optional: true,
          doc: 'all for fetch balance of all tokens rather than tokens under each address',
        },
        [enums, 'all'],
      ],
      [
        'allNetwork',
        {optional: true, doc: 'true to refetch balance of all network'},
        truep,
      ],
    ],
  ],
}

export const permissions = {
  external: ['popup'],
  locked: true,
  methods: ['wallet_getBalance'],
  db: ['getSingleCallBalanceParams', 'upsertBalances'],
}

export const main = async ({
  db: {getSingleCallBalanceParams, upsertBalances},
  params,
  rpcs: {wallet_getBalance},
}) => {
  const refetchBalanceParams = getSingleCallBalanceParams({
    type: params?.type || 'refresh',
    allNetwork: Boolean(params?.allNetwork),
  })

  // eslint-disable-next-line no-unused-vars
  const promises = refetchBalanceParams.map(([_, [users, tokens, network]]) =>
    wallet_getBalance(
      {network, networkName: network.name},
      {users, tokens},
    ).then(rst => {
      return rst && upsertBalances({data: rst, networkId: network.eid})
    }),
  )

  await Promise.all(promises)
  return true
}