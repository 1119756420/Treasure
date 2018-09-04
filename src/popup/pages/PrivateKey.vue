<template>
    <div>
        <app-header subtitle="Export Private Key" />

        <main class="main">
            <div v-if="wallet">
                <div class="form-info">
                    {{$t('w.privateKeyTips')}}
                </div>

                <div class="input-group">
                    <textarea class="input-field special" type="text" v-model="wallet.privateKey" readonly></textarea>

                    <button class="button" title="Copy to clipboard" v-clipboard:copy="wallet.privateKey">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="icon"><path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 0 1 2 2v4h4V2H8v4zM2 8v10h10V8H2z"/></svg>
                    </button>
                </div>

                <div class="form-info">
                    <p><strong>{{$t('w.doNotLost')}}</strong> {{$t('w.doNotLostTips')}}</p>
                    <p><strong>{{$t('w.doNotShare')}}</strong> {{$t('w.doNotShareTips')}}</p>
                    <p><strong>{{$t('w.backup')}}</strong> {{$t('w.backupTips')}}</p>
                </div>

                <router-link to="/" class="button brand">{{$t('w.haveSave')}}</router-link>
            </div>

            <div v-else>
                <form @submit.prevent="submitForm" action="" method="post" class="auth-form">
                    <div class="form-info">
                        {{$t('w.enterPassword')}}
                    </div>

                    <div v-show="error.show" class="message error">
                        {{ error.message }}
                    </div>

                    <input class="input-field" type="password" name="password" placeholder="Password" v-model="password">

                    <button class="button brand" type="submit">{{$t('w.submit')}}</button>
                </form>
            </div>
        </main>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { decryptKeyStore } from '../../lib/keystore'
    import AppHeader from '../components/AppHeader.vue'

    export default {
        components: {
            AppHeader
        },

        data: () => ({
            password: '',
            wallet: false,
            error: {
                show: false,
                message: ''
            }
        }),

        computed: mapState({
            keystore: state => state.wallet.keystore,
        }),

        methods: {
            submitForm() {
                const wallet = decryptKeyStore(this.password, this.keystore)

                if (!wallet) {
                    this.error.show = true
                    this.error.message = 'Password is incorrect'

                    return false
                }

                this.wallet = wallet
            }
        }
    }
</script>
