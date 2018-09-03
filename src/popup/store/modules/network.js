export default {
    namespaced: true,

    state: {
        id: 1,
        name: 'MainNet',
        url:'http://api.trondapps.org',
        transcanUrl:'https://api.tronscan.org',
        type: 'MainNet'
    },

    mutations: {
        change(state, network) {
            state.id = network.id
            state.name = network.name
            state.url = network.url
            state.type = network.type
            state.transcanUrl = network.transcanUrl
        }
    }
}
