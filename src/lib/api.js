//import { Client } from '@tronscan/client'
import TronWeb from 'tronweb'
import store from '../popup/store'

export default function API() {
    const tronWeb = new TronWeb(store.state.network.url);
    //client.apiUrl = store.state.network.url

    return tronWeb
}
