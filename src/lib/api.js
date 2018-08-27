//import { Client } from '@tronscan/client'
import TronWeb from 'tronweb'
import store from '../popup/store'

export default function API() {
    let tronWeb = new TronWeb(store.state.network.url);
    tronWeb.defaultAccount = store.state.wallet.address;
    //client.apiUrl = store.state.network.url
    chrome.extension.getBackgroundPage().sendTronWeb(tronWeb);
    return tronWeb
}
