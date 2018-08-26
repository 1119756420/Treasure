<template>
    <div>
        <app-header subtitle="Freeze Balance" @refresh="loadAccount" />

        <main class="main">
            <form @submit.prevent="freezeBalance" action="" method="post" class="auth-form">
                <div class="form-info">
                    Frozen tokens are "locked" for a period of 3 days. During this period the frozen TRX cannot be traded. After this period you can unfreeze the TRX and trade the tokens.
                </div>

                <div v-show="message.show" class="message" :class="[ message.type ]">
                    {{ message.text }}
                </div>

                <label class="input-label">
                    TRX Amount
                    <input class="input-field" type="number" name="amount" v-model="amount">
                </label>

                <button class="button brand" type="submit">Freeze Balance</button>
            </form>
        </main>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { decryptKeyStore } from '../../lib/keystore'
    import { getTokenAmount, getTokenRawAmount } from '../../lib/utils'
    import API from '../../lib/api'
    import AppHeader from '../components/AppHeader.vue'

    export default {
        components: {
            AppHeader
        },

        data: () => ({
            amount: 0,
            message: {
                show: false,
                type: 'error',
                text: ''
            }
        }),

        computed: mapState({
            wallet: state => state.wallet,
            balance: state => state.account.balance
        }),

        methods: {
            async loadAccount() {
                this.$store.commit('loading', true)

                const accountData = await API().getAccountByAddress(this.wallet.address)

                let account = {}
                account.balance = getTokenAmount(accountData.balance)
                account.bandwidth = accountData.bandwidth.netRemaining
                account.freeBandwidth = accountData.bandwidth.freeNetRemaining
                account.frozen = getTokenAmount(accountData.frozen.total)
                account.frozenExpires = (accountData.frozen.balances.length > 0) ? accountData.frozen.balances[0].expires : 0

                this.$store.commit('account/change', account)
                this.$store.commit('account/tokens', accountData.tokenBalances)
                this.$store.commit('loading', false)
            },

            async freezeBalance() {
                this.message.show = false

                if (this.amount < 1) {
                    this.message.show = true
                    this.message.text = 'Minimum amount to freeze is 1 TRX'

                    return false
                }

                if (this.amount > this.balance) {
                    this.message.show = true
                    this.message.text = 'Insufficient funds'

                    return false
                }

                const wallet = decryptKeyStore(this.wallet.keypass, this.wallet.keystore)

                if (!wallet) {
                    this.message.show = true
                    this.message.text = 'Something went wrong while trying to freeze TRX'

                    return false
                }

                this.$store.commit('loading', true)

                const amount = getTokenRawAmount(this.amount)

                try {
                    const { success } = await API().freezeBalance(this.wallet.address, amount, 3)(wallet.privateKey)


                    this.message.show = true

                    if (success) {
                        this.message.type = 'success'
                        this.message.text = 'TRX is frozen successfully'
                    }else {
                        this.message.text = 'Something went wrong while trying to freeze TRX'
                    }

                    this.loadAccount()
                    this.amount = 0

                    this.$store.commit('loading', false)
                } catch (e) {
                    this.$store.commit('loading', false)

                    this.message.show = true
                    this.message.text = 'Something went wrong while trying to freeze TRX'
                }
            }
        }
    }
</script>
