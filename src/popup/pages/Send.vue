<template>
    <div>
        <app-header subtitle="Send Payment" @refresh="loadTokens" v-show="fromPage?false:true"/>

        <main class="main">
            <form @submit.prevent="sendPayment" action="" method="post" class="auth-form">
                <div v-show="message.show" class="message" :class="[ message.type ]">
                    {{ message.text }}
                </div>

                <label class="input-label">
                    Receipient Address
                    <input class="input-field" type="text" name="address" v-model="receipient" :readonly="fromPage?true:false">
                </label>

                <label class="input-label">
                    Token
                    <select class="input-field" v-model="selectedToken">
                        <option v-for="token in tokens" :key="token.name" :value="token">
                            {{ token.name }} ({{ $formatNumber(token.balance, { maximumSignificantDigits: 7 }) }} available)
                        </option>
                    </select>
                </label>

                <label class="input-label">
                    Amount
                    <input class="input-field" type="number" name="amount" v-model="amount" step="any" :readonly="fromPage?true:false">
                </label>

                <button class="button brand" type="submit">Send</button>
            </form>
        </main>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { decryptKeyStore } from '../../lib/keystore'
    import { getTokenRawAmount,getTokenAmount } from '../../lib/utils'
    import { isAddressValid } from '@tronscan/client/src/utils/crypto'
    import API from '../../lib/api'
    import AppHeader from '../components/AppHeader.vue'

    export default {
        components: {
            AppHeader
        },

        data: () => ({
            amount: 0,
            receipient: '',
            transaction:'',
            selectedToken: false,
            fromPage:false,
            message: {
                show: false,
                type: 'error',
                text: ''
            }
        }),
        created(){
            let oData = chrome.extension.getBackgroundPage().backgroundData;
            let to='';
            let amountTrx=0;
            if(oData){
                if(Object.keys(oData).length>0){
                    console.log('transaction::',oData.data);
                    let {raw_data} = oData.data;
                    let contract = raw_data.contract[0];
                    let type = contract.type;
                    if(type=='TriggerSmartContract'){
                        to = API().fromHex( contract.parameter.value.contract_address);
                        let call_value = contract.parameter.value.call_value||0;
                        amountTrx =  API().sunToTrx(call_value);
                    }else{
                        amountTrx = API().sunToTrx(contract.parameter.value.amount);
                        to = API().fromHex( contract.parameter.value.to_address);
                    }
                    oData.data = JSON.stringify(oData.data);
                    this.fromPage = true
                }
            }
            this.amount = amountTrx||0;
            this.receipient = to||'';
            this.transaction = oData.data||'';
            //console.log('transaction:::',this.transaction);
        },

        computed: mapState({
            wallet: state => state.wallet,
            tokens: state => state.account.tokens
        }),

        mounted() {
            this.loadTokens()
        },

        methods: {
            async loadTokens() {
                this.$store.commit('loading', true)

                const accountData = await API().getBalance(this.wallet.address)

                this.$store.commit('account/tokens', [{name:'TRX',balance: getTokenAmount(accountData.balance)}])
                this.$store.commit('loading', false)

                if (this.tokens.length > 0) {
                    this.selectedToken = this.tokens[0]
                }
            },
            //通知页面
            notityPage(sendResult){
                //调用background
                chrome.extension.getBackgroundPage().sendMsg(sendResult);
            },
            async sendPayment() {
                this.message.show = false

                if (!isAddressValid(this.receipient)) {
                    this.message.show = true
                    this.message.text = 'Invalid Recipient Address'

                    return false
                }

                if (!this.selectedToken) {
                    this.message.show = true
                    this.message.text = 'Please select token that you want to send'

                    return false
                }

                if (this.amount > this.selectedToken.balance) {
                    this.message.show = true
                    this.message.text = 'Insufficient funds'

                    return false
                }

                const wallet = decryptKeyStore(this.wallet.keypass, this.wallet.keystore)

                if (!wallet) {
                    this.message.show = true
                    this.message.text = 'Something went wrong while trying to broadcast the transaction'

                    return false
                }

                let amount = this.amount

                if (this.selectedToken.name === "TRX") {
                    amount = getTokenRawAmount(this.amount);
                }

                this.$store.commit('loading', true)

                try {
                    //转账
                    let transaction = await API().createTransaction(this.receipient,this.wallet.address,amount);
                    if(this.transaction){
                        transaction = JSON.parse(this.transaction);
                    }
                    const signTransaction = await API().signTransaction(transaction,wallet.privateKey,0);
                    const {result} = await API().sendRawTransaction(signTransaction);
                    let success = result;
                    this.$store.commit('loading', false)

                    this.message.show = true
                    this.notityPage({success,transaction});

                    if (success) {
                        this.message.type = 'success'
                        this.message.text = 'Transaction successfully broadcasted to the network'

                    }else {
                        this.message.text = 'Something went wrong while trying to broadcast the transaction'
                    }

                    this.loadTokens()
                    this.receipient = ''
                    this.amount = 0
                } catch (e) {
                    this.$store.commit('loading', false)

                    this.message.show = true
                    this.message.text = 'Something went wrong while trying to broadcast the transaction'
                }
            }
        }
    }
</script>
