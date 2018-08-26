<template>
    <div>
        <app-header @refresh="refreshTokens" />

        <main class="main">
            <div v-if="tokens.length === 0 || tokens.length === 1 & tokens[0].name === 'TRX'" class="message-empty">
                No tokens found
            </div>

            <div v-else>
                <div class="token" v-for="token in tokens" :key="token.name" v-if="token.name !== 'TRX'">
                    <span class="token-name">{{ token.name }}</span>
                    <span class="token-balance">{{ $formatNumber(token.balance, { maximumSignificantDigits: 7 }) }}</span>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { getTokenAmount } from '../../lib/utils'
    import API from '../../lib/api'
    import AppHeader from '../components/AppHeader.vue'

    export default {
        components: {
            AppHeader
        },

        computed: mapState({
            tokens: state => state.account.tokens,
            address: state => state.wallet.address,
            keystore: state => state.wallet.keystore,
        }),

        mounted() {
            this.loadTokens()
        },

        methods: {
            async loadTokens() {
                const accountData = await API().getAccountByAddress(this.address)
                this.$store.commit('account/tokens', accountData.tokenBalances)
                this.$store.commit('loading', false)
            },

            refreshTokens() {
                this.$store.commit('loading', true)
                this.loadTokens()
            }
        }
    }
</script>

<style>
    .token {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        background: #FFFFFF;
        border-radius: 5px;
        padding: 1rem;
        margin-bottom: 0.75rem;
    }
    .token span {
        display: block;
    }
    .token-name {
        color: #9E9E9E;
        font-size: 0.875rem;
    }
    .token-balance {
        font-size: 1rem;
        font-weight: 600;
        text-align: right;
        word-break: break-all;
        padding-left: 1rem;
    }
</style>

