export default {
    namespaced: true,

    state: {
        balance: 0,
        bandwidth: 0,
        freeBandwidth: 0,
        frozen: 0,
        frozenExpires: 0,
        tokens: [],
        transfers: [],
        transactions:[],
        latest_opration_time:''
    },

    mutations: {
        change(state, account) {
            state.balance = account.balance
            state.bandwidth = account.bandwidth
            state.freeBandwidth = account.freeBandwidth
            state.frozen = account.frozen
            state.frozenExpires = account.frozenExpires
            state.latest_opration_time = account.latest_opration_time
        },

        tokens(state, tokens) {
            state.tokens = tokens
        },

        transfers(state, transfers) {
            state.transfers = transfers
        },

        pushTransfers(state, transfers) {
            state.transfers.push(...transfers)
        },

        transactions(state, transactions) {
            state.transactions = transactions
        },

        pushTransactions(state, transactions) {
            state.transactions.push(...transactions)
        }
    }
}
