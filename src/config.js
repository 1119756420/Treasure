export default {
    networks: [
        {
            id: 1,
            name: 'MainNet',
            transcanUrl:'https://api.tronscan.org',
            url:'http://api.trondapps.org',
            type: 'MainNet'
        },
        {
            id: 2,
            name: 'TestNet',
            transcanUrl: 'https://testapi.tronscan.org',
            url:'http://testapi.trondapps.org',
            type: 'TestNet'
        },
        {
            id:3,
            name:'PrivateNet',
            transcanUrl:'https://testapi.tronscan.org',
            url:'http://52.44.75.99:8090',
            type: 'PrivateNet'
        }
    ]
}
