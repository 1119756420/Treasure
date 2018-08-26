import { Transaction } from '@tronscan/client/src/protocol/core/Tron_pb'
import store from '../popup/store';

let contractTypes = {}

for (let key of Object.keys(Transaction.Contract.ContractType)) {
    contractTypes[Transaction.Contract.ContractType[key]] = key
}

export const CONTRACT_TYPES = contractTypes
export const ONE_TRX = 1000000

export function getTokenAmount(rawAmount) {
    return rawAmount / ONE_TRX
}

export function getTokenRawAmount(amount) {
    return amount * ONE_TRX
}

export function getTronScanLink(path) {
    //const domain = (store.state.network.type === 'mainnet') ? 'https://tronscan.org/#/' : 'https://test.tronscan.org/#/'
    const domain = (store.state.network.type === 'MainNet') ? 'https://tronscan.org/#/' : 'https://test.tronscan.org/#/'
    return domain + path
}
