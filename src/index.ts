import { closeDb, connectToDb } from "./db/db";
import constants from './constants/constants.json';
import fs from 'fs';
import { Car, Engine } from "./db/types";
import { WithId } from "mongodb";

async function main() {
  const db = await connectToDb();

  removeFiles();

  const carsCollection = db.collection<Car>(constants.cars_name);
  const enginesCollection = db.collection<Engine>(constants.engines_name);

  let cars = await carsCollection.find({});

  const jsonStream = fs.createWriteStream(constants.json_path);
  jsonStream.write('[');

  while(await cars.hasNext()) {
    const car = await cars.next();
    const engine = await enginesCollection.findOne({id: car!.engine_regulation});

    const json = getJson(car!, engine!, await cars.hasNext());

    jsonStream.write(json);
  }

  jsonStream.write(`
]
`);
  jsonStream.close();

  cars = await carsCollection.find({});

  const csvStream = fs.createWriteStream(constants.csv_path);
  csvStream.write(getCsvHeader());

  while(await cars.hasNext()) {
    const car = await cars.next();
    const engine = await enginesCollection.findOne({id: car!.engine_regulation});

    const csv = getCsv(car!, engine!);

    csvStream.write(csv);
  }

  csvStream.close();

  await closeDb();
}

function removeFiles() {
  if(fs.existsSync(constants.json_path)) {
    fs.rmSync(constants.json_path);
  }

  if(fs.existsSync(constants.csv_path)) {
    fs.rmSync(constants.csv_path);
  }
}

function getJson(car: WithId<Car>, engine: WithId<Engine>, isLast: boolean): string {
  return `
  {
    "id": "${car.id}",
    "team": "${car.team}",
    "year": "${car.year}",
    "engine_regulation": {
      "id": "${engine.id}",
      "years": [${engine.years.map(year => `"${year}"`)}],
      "induction": [${engine.induction.map(ind => `"${ind}"`)}],
      "number_of_pistons": ${engine.number_of_pistons},
      "layout": "${engine.layout}",
      "bank_angle": ${engine.bank_angle?.toFixed(2) ?? null},
      "max_displacement": [${engine.max_displacement.map(dis => dis.toFixed(1))}],
      "rev_limit": ${engine.rev_limit}
    },
    "length": ${car["length"]?.toFixed(1) ?? null},
    "width": ${car.width?.toFixed(1) ?? null},
    "height": ${car.height?.toFixed(1) ?? null},
    "weight": ${car.weight?.toFixed(1) ?? null},
    "tyre": "${car.tyre}"
  }${isLast ? ',' : ''}`;
}

function getCsvHeader(): string {
  return `id,team,year,length,width,height,weight,tyre,engine_id,engine_years,engine_induction,engine_number_of_pistons,engine_layout, engine_bank_angle,engine_max_displacement,engine_rev_limit\n`;
}

function getCsv(car: WithId<Car>, engine: WithId<Engine>): string {
  return `${car.id},${car.team},${car.year},${car["length"]?.toFixed(1) ?? null},${car.width?.toFixed(1) ?? null},${car.height?.toFixed(1) ?? null},${car.weight?.toFixed(1) ?? null},${car.tyre},${engine.id},"${engine.years}","${engine.induction}",${engine.number_of_pistons},${engine.layout},${engine.bank_angle?.toFixed(1) ?? null},"${engine.max_displacement}",${engine.rev_limit ?? null}\n`;
}

main();