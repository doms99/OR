import { MongoClient, Db } from 'mongodb';
import constants from '../constants/constants.json';

let client: MongoClient | null;

async function connectToDb(): Promise<Db> {
  if(client == null) {
    client = new MongoClient(constants.db_url);

    await client.connect();
  }

  return client!.db();
}

async function closeDb(): Promise<void> {
  if(client == null) {
    return;
  }

  await client.close();
  client = null;
}

export { connectToDb, closeDb }