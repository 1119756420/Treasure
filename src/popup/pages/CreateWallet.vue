<template>
     <div class="auth">
        <div class="auth-logo">
            <img src="images/tronmask.png" alt="Treasure">
        </div>

        <h1 class="auth-title">Treasure</h1>

        <div v-if="wallet">
            <div class="message error">
                {{$t('w.save')}}
            </div>

            <div class="input-group">
                <textarea class="input-field special" type="text" rows="3" v-model="wallet.privateKey" readonly></textarea>

                <button class="button" title="Copy to clipboard" v-clipboard:copy="wallet.privateKey">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="icon"><path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 0 1 2 2v4h4V2H8v4zM2 8v10h10V8H2z"/></svg>
                </button>
            </div>

            <div class="form-info">
                <p><strong>{{$t('w.doNotLost')}}</strong> {{$t('w.doNotLostTips')}}</p>
                <p><strong>{{$t('w.doNotShare')}}</strong> {{$t('w.doNotShareTips')}}</p>
                <p><strong>{{$t('w.backup')}}</strong> {{$t('w.backupTips')}}</p>
            </div>

            <a class="button brand" @click="savePrivateKey">{{$t('w.haveSave')}}</a>
        </div>

        <div v-else>
            <div v-show="error.show" class="message error">
                {{ error.message }}
            </div>

            <form @submit="submitForm" action="" method="post" class="auth-form">
                <input class="input-field" type="password" name="password" :placeholder="$t('w.passwordTips')" v-model="password">

                <div class="form-info">
                    {{$t('w.createTips')}}
                </div>

                <button class="button brand" type="submit"><span v-text="$t('w.createWallet')"></span></button>

                <div v-if="keystore">
                    <a class="auth-link" @click="$router.back()"><span v-text="$t('w.cancel')"></span></a>
                </div>

                <div v-else>
                    <div class="line-through">
                        <span>or</span>
                    </div>

                    <router-link class="button" to="/import-wallet">{{$t('w.import')}}</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { encryptKeyStore } from '../../lib/keystore'
    import { generateAccount } from '@tronscan/client/src/utils/account'

    export default {
        data: () => ({
            password: '',
            wallet: false,
            error: {
                show: false,
                message: ''
            }
        }),

        computed: mapState({
            address: state => state.wallet.address,
            keystore: state => state.wallet.keystore,
        }),

        methods: {
            submitForm(e) {
                e.preventDefault()

                if (this.password.length < 8) {
                    this.error.show = true
                    this.error.message = 'Password is not long enough'

                    return false
                }

                this.wallet = generateAccount();
            },

            savePrivateKey(e) {
                e.preventDefault()

                const keystore = encryptKeyStore(this.password, this.wallet.privateKey, this.wallet.address)

                this.$store.commit('wallet/address', this.wallet.address)
                this.$store.commit('wallet/keypass', this.password)
                this.$store.commit('wallet/keystore', keystore)
                this.$router.push('/')
            }
        }
    }
</script>
