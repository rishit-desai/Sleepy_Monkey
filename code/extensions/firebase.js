const firebase_sdk = require('firebase-admin');
const firebaseConfig = require('../../config_firebase.json')

firebase_sdk.default.initializeApp({
    credential: firebase_sdk.credential.cert(firebaseConfig)
})

const database = firebase_sdk.firestore()
const config = database.collection('config')

class firebase {
    constructor(bot) {
        this.client = bot;
        this.client.cache = {
            voice : {},
            config : {}
        }
    }

    async load_config() {
        let res = await config.get()
        res.docs.forEach( doc => {
            if (doc.id == 'test') return;
            let data = doc.data()
            this.client.cache.config[doc.id] = {};
            this.client.cache.config[doc.id] = data
        })
    }

    async upsert(collection, doc, val){
        let document = database.collection(collection).doc(doc)
        if(Object.keys(val).length == 0) {
            if((await document.get()).exists) 
                document.delete()
            return
        }
        database.collection(collection).doc(doc).set(val)
    }

    async update_config(guid) {
        this.upsert('config', guid, this.client.cache.config[guid])
    }
}

module.exports = firebase