<template>
    <div>
        <app-header subtitle="Setting" />
        <main class="main">
            <form>
                <div class="form-info">
                    Change language
                </div>

                <select v-model="selectedLng">
                    <option value="en">en-US</option>
                    <option value="zh">zh-CN</option>
                </select>
                <div>
                    <button class="button brand" @click="toggleLang">Confirm</button>
                </div>
            </form>

        </main>
    </div>
</template>

<script>
    import AppHeader from '../components/AppHeader.vue'
    export default {
        data:()=>({
           selectedLng:''
        }),
        components:{
            AppHeader
        },
        created(){
           this.selectedLng=this.$i18n.locale;
        },
        methods:{
            toggleLang(){
                this.$i18n.locale = this.selectedLng
            }
        }
    }
</script>

<style scoped>

</style>