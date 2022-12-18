var { MongoClient } = require('mongodb');
var constants = require('../constants/constants.json');

let client;

async function connectToDb() {
  if(client == null) {
    client = new MongoClient(constants.db_url);

    await client.connect();
  }

  return client.db();
}

async function closeDb(){
  if(client == null) {
    return;
  }

  await client.close();
  client = null;
}

function getDb() {
  return client.db();
}

module.exports = { connectToDb, closeDb, getDb }