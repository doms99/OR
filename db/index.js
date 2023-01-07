var { getDb } = require("./db");
var constants = require('../constants/constants');
const crypto = require("crypto");

async function getObject(query) {
  const db = getDb();

  const carsCollection = db.collection(constants.cars_name);
  const enginesCollection = db.collection(constants.engines_name);

  let cars = await carsCollection.find({});

  const res = [];
  outer:
  while(await cars.hasNext()) {
    const car = await cars.next();
    const engine = await enginesCollection.findOne({id: car.engine_regulation});

    car.engine_regulation = engine;

    if(Object.entries(query).length == 0) {
      res.push(car);
      continue;
    }

    if(query.all != undefined) {
      for(const value of Object.values(engine)) {
        if(`${value}`.includes(query.all)) {
          res.push(car);
          continue outer;
        }
      }
      for(const value of Object.value(car)) {

        if(`${value}`.includes(query.all)) {
          res.push(car);
          continue outer;
        }
      }
    } else {
      for (const [key, value] of Object.entries(query)) {
        if(key.includes('engine')) {
          const key2 = key.split('-')[1];

          if(`${car.engine_regulation[key2]}`.includes(value)) {
            res.push(car);
            continue outer;
          }
        } else {
          if(`${car[key]}`.includes(value)) {
            res.push(car);
            continue outer;
          }
        }
      }
    }
  }

  return res;
}

async function collect(cursor) {
  const res = [];
  while(await cursor.hasNext()) {
    res.push(await cursor.next());
  }
  return res;
}

async function getCars() {
  const db = getDb();

  const carsCollection = db.collection(constants.cars_name);

  const cars = await collect(await carsCollection.find({}));

  for (const car of cars) {
    delete car._id;
    car.engine_regulation = await getEngine(car.engine_regulation);
    if(car.engine_regulation?._id != null) {
      delete car.engine_regulation._id;
    }
  }

  return cars;
}

async function getCar(id) {
  const db = getDb();

  const carsCollection = db.collection(constants.cars_name);

  const car = await carsCollection.findOne({id: id});
  if(car == null) return null;

  delete car._id;
  car.engine_regulation = await getEngine(car.engine_regulation);
  if(car.engine_regulation?._id != null) {
    delete car.engine_regulation._id;
  }

  return car;
}

async function insertCar(car) {
  const db = getDb();
  let id;

  const carsCollection = db.collection(constants.cars_name);

  while(await carsCollection.findOne({id}) != null) {
    id = crypto.randomBytes(16).toString("hex");
  }

  await carsCollection.insertOne({
    ...car,
    id: id,
    engine_regulation: (await getEngineForYear(car.year))?.id
  });

  return getCar(id);
}

async function updateCar(id, car) {
  const db = getDb();

  const carsCollection = db.collection(constants.cars_name);

  const carDb = await carsCollection.findOne({id: id});
  await deleteCar(id);
  await carsCollection.insertOne({
    ...carDb,
    ...car,
    engine_regulation: (await getEngineForYear(car.year))?.id
  });

  return getCar(id);
}

async function deleteCar(id) {
  const db = getDb();

  const carsCollection = db.collection(constants.cars_name);

  const result = await carsCollection.deleteOne({id: id});

  return result.deletedCount > 0;
}

async function getCarsForEngine(engineId) {
  const db = getDb();

  const carsCollection = db.collection(constants.cars_name);

  let cars = await collect(await carsCollection.find({}));
  cars = cars.filter(car => car.engine_regulation == engineId);

  for (const car of cars) {
    delete car._id;
    car.engine_regulation = await getEngine(car.engine_regulation);
    if(car.engine_regulation?._id != null) {
      delete car.engine_regulation._id;
    }
  }

  return cars;
}

async function getEngines() {
  const db = getDb();

  const enginesCollection = db.collection(constants.engines_name);

  const engines = await collect(await enginesCollection.find({}));
  for (const engine of engines) {
    delete engine._id;
  }

  return engines;
}

async function getEngineForYear(year) {
  const db = getDb();

  const enginesCollection = db.collection(constants.engines_name);

  const engines = await collect(await enginesCollection.find({}));
  for (const engine of engines) {
    if(engine.years.includes(year)) return engine;
  }

  return null;
}

async function getEngine(id) {
  const db = getDb();

  const enginesCollection = db.collection(constants.engines_name);

  const engine = await enginesCollection.findOne({id: id});
  if(engine == null) return null;

  delete engine._id;

  return engine;
}

async function updateUser({ provider, id, username, displayName, token, tokenSecret }) {
  const db = getDb();

  const usersCollection = db.collection(constants.users_name);
  await usersCollection.insertOne({ provider, id, username, displayName, token, tokenSecret });

  const user = await usersCollection.findOne({ provider, id });
  delete user._id;
  delete user.tokenSecret;

  return user;
}

async function deleteUser({ provider, id }) {
  const db = getDb();

  const usersCollection = db.collection(constants.users_name);
  await usersCollection.deleteOne({ provider, id });
}

async function getUser(token) {
  const db = getDb();

  const usersCollection = db.collection(constants.users_name);
  const user = await usersCollection.findOne({token});
  delete user._id;
  delete user.tokenSecret;

  return user;
}

module.exports = { getObject, getCars, getCar, insertCar, updateCar, deleteCar, getCarsForEngine, getEngines, getEngine, updateUser, deleteUser, getUser }