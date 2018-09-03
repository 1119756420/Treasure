<template>
    <div>
        <app-header subtitle="Setting" />
        <main class="main">
            <form>
                <div class="form-info">
                    Change language
                </div>

                <select class="input-field" v-model="selectedLng">
                    <option value="en">{{$t('w.en')}}</option>
                    <option value="zh">{{$t('w.zh')}}</option>
                </select>
                <div>
                    <input type="button" class="button brand" @click="toggleLang" :value="$t('w.confirm')">
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
                localStorage.curLng = this.selectedLng;
                this.$router.replace('/');
            }
        }
    }
</script>

<style scoped>

</style>