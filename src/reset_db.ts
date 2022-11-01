import constants from './constants/constants.json';
import cars from './data/cars.json';
import engines from './data/engines.json';
import { closeDb, connectToDb } from './db/db';

async function reset() {
  const db = await connectToDb();

  await Promise.all([
    db.dropCollection(constants.cars_name),
    db.dropCollection(constants.engines_name)
  ]);

  const carsCollection = await db.createCollection(constants.cars_name);
  const enginesCollection = await db.createCollection(constants.engines_name);

  await enginesCollection.insertMany(engines);
  await carsCollection.insertMany(cars);

  await closeDb();
}

reset();