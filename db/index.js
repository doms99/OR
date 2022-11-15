var { getDb } = require("./db");
var constants = require('./constants/constants.json');

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
      for(const [key, value] of Object.entries(engine)) {
        if(`${value}`.includes(query.all)) {
          res.push(car);
          continue outer;
        }
      }
      for(const [key, value] of Object.entries(car)) {

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

module.exports = { getObject }