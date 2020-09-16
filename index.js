const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const databaseName = 'task-manager'
const connectionURL = 'mongodb://127.0.0.1:27017'
MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('someting wrong')
    }
    const db = client.db(databaseName)
    const collection = db.collection('users')
    collection.updateMany({ name: 'Rajkumar' }, {
        $inc: {
            rollno: 6
        }
    }).then((resolvse) => console.log(resolvse)).catch((reject) => console.log(reject))
})