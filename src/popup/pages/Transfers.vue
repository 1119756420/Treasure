<template>
    <div>
        <app-header @refresh="refreshTransfers" />

        <main class="main">
            <div v-if="transfers.length === 0" class="message-empty">
                No transfers yet
            </div>

            <div v-else>
                <div>
                    <external-link :url="getTransferLink(transfer.transactionHash)" class="transfer" v-for="transfer in transfers" :key="transfer.transactionHash">
                        <span v-if="isOutgoingTransfer(transfer)" class="transfer-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6.5 24 24" width="24" height="24" preserveAspectRatio="xMinYMin" class="icon"><path d='M7.828 2.414H2.243a1 1 0 1 1 0-2h8a.997.997 0 0 1 1 1v8a1 1 0 0 1-2 0V3.828l-6.779 6.779A1 1 0 0 1 1.05 9.192l6.778-6.778z' /></svg>
                        </span>
                        <span v-else class="transfer-icon incoming">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6.5 -6.5 24 24" width="24" height="24" preserveAspectRatio="xMinYMin" class="icon"><path d='M3.828 8.9h5.586a1 1 0 0 1 0 2h-8a.997.997 0 0 1-1-1v-8a1 1 0 1 1 2 0v5.585L9.192.707a1 1 0 1 1 1.415 1.414L3.828 8.9z' /></svg>
                        </span>

                        <span class="transfer-content">
                            <span v-if="isOutgoingTransfer(transfer)" class="transfer-address">
                                {{ compressAddress(transfer.transferToAddress) }}
                            </span>
                            <span v-else class="transfer-address">
                                {{ compressAddress(transfer.transferFromAddress) }}
                            </span>

                            <span class="transfer-date">{{ $formatDate(transfer.timestamp, { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                        </span>

                        <span v-if="isOutgoingTransfer(transfer)" class="transfer-amount">
                            - {{ $formatNumber(getTokenAmount(transfer), { maximumSignificantDigits: 2 }) }} {{ transfer.tokenName }}
                        </span>
                        <span v-else class="transfer-amount incoming">
                            + {{ $formatNumber(getTokenAmount(transfer), { maximumSignificantDigits: 2 }) }} {{ transfer.tokenName }}
                        </span>
                    </external-link>
                </div>

                <a class="load-more" v-show="page < lastPage && ! loadMoreLoading" href="#" @click="loadMore">Load More</a>
            </div>
        </main>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { getTokenAmount, getTronScanLink } from '../../lib/utils'
    import API from '../../lib/api'
    import AppHeader from '../components/AppHeader.vue'
    import ExternalLink from '../components/ExternalLink.vue'

    export default {
        components: {
            AppHeader,
            ExternalLink
        },

        data: () => ({
            start: 0,
            limit: 30,
            page: 1,
            lastPage: 1,
            loadMoreLoading: false
        }),

        computed: mapState({
            address: state => state.wallet.address,
            keystore: state => state.wallet.keystore,
            transfers: state => state.account.transfers,
        }),

        mounted() {
            this.loadTransfers()
        },

        methods: {
            async loadTransfers() {
                this.page = 1
                this.start = 0

                const transfersData = await API().getTransfers({ address: this.address, start: this.start , limit: this.limit })
                this.lastPage = Math.ceil(transfersData.total / this.limit)

                this.$store.commit('account/transfers', transfersData.transfers)
                this.$store.commit('loading', false)
            },

            async loadMore(e) {
                e.preventDefault();
                this.loadMoreLoading = true

                this.start += this.limit
                const transfersData = await API().getTransfers({ address: this.address, start: this.start, limit: this.limit })

                this.page += 1
                this.$store.commit('account/pushTransfers', transfersData.transfers)
                this.loadMoreLoading = false
            },

            refreshTransfers(){
                this.$store.commit('loading', true)
                this.loadTransfers()
            },

            getTransferLink(hash) {
                const path = 'transaction/' + hash

                return getTronScanLink(path)
            },

            isOutgoingTransfer(transfer) {
                return transfer.transferFromAddress === this.address
            },

            getTokenAmount(transfer) {
                if (transfer.tokenName === 'TRX') {
                    return getTokenAmount(transfer.amount)
                }

                return transfer.amount
            },

            compressAddress(address) {
                return address.substr(0, 10) + '...' + address.substr(address.length - 5, address.length)
            }
        }
    }
</script>

<style>
    .transfer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.5s ease;
        background: #FFFFFF;
        border-radius: 5px;
        padding: 0;
        margin-bottom: 0.75rem;
        font-size: 0.75rem;
        color: #424242;
    }
    .transfer:hover,
    .transfer:focus {
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }
    .transfer:active {
        transform: translateY(1px);
    }
    .transfer-content,
    .transfer-address,
    .transfer-date,
    .transfer-amount {
        display: block;
    }
    .transfer-icon {
        display: flex;
        font-size: 24px;
        padding: 8px;
        width: 40px;
        color: #F44336;
    }
    .transfer-content {
        flex: 1;
        padding: 0.625rem 0;
    }
    .transfer-address {
        font-weight: 600;
        margin-bottom: 3px;
        color: #424242;
    }
    .transfer-date {
        color: #BDBDBD;
        font-size: 0.625rem;
    }
    .transfer-amount {
        flex: 1;
        padding: 0.5rem 0.625rem;
        font-size: 0.75rem;
        word-break: break-all;
        text-align: right;
    }
    .transfer-icon,
    .transfer-amount {
        color: #F44336;
    }
    .transfer-icon.incoming,
    .transfer-amount.incoming {
        color: #8BC34A;
    }
</style>

