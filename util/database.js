const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback)=>{

  MongoClient.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5")
    .then((client) => {
      console.log(`mongoconnected hogaya!!!!`);

      _db = client.db('node-learn');
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });

}

const getDb = ()=>{
  if (_db) {
    return _db;
  }
  throw 'No DATABASE found!!!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
