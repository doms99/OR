function ldCar(car) {
  car["@context"] = "https://schema.org/";
  car["@type"] = "Car";
  car.wheelbase = car.length;
}

function ldEngine(engine, needContext = true) {
  if(needContext) {
    engine["@context"] = "https://schema.org/";
  }
  engine["@type"] = "EngineSpecification";
  engine["engineDisplacement"] = engine.max_displacement?.[0];
  engine["engineType"] = engine.induction?.join(" or ");
}

module.exports = { ldCar, ldEngine }