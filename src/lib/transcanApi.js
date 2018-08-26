import { Client } from '@tronscan/client'
import store from '../popup/store'

export default function API() {
    let client = new Client();
    client.apiUrl = store.state.network.transcanUrl
    return client
}
