# Lab 1

# Description

| Title | Winning F1 cars by year |
| --- | --- |
| URI | https://github.com/doms99/OR.git |
| Keywords | F1, cars, engines, racing |
| Publication date | 2022-11-01 |
| Publisher | Dominik Mandić |
| Creator | Dominik <dominik.mandic@fer.hr> |
| Period that the dataset covers | 1995-2020 |
| Theme | F1 |
| Language | English |
| Current version | 1.0 |

# Car object

## JSON data format

```json

{
  "id": string,
  "team": string,
  "year": string,
  "engine_regulation": engine_regulation_object,
  "tyre": string,
  "length": double || null,
  "width": double || null,
  "height": double || null,
  "weight": double || null
}
```

## Fields

### id `string`

Unique id of that object.

### team `string`

Team name of winning car.

### year `string`

Year that car won the championship.

### engine_regulation `engine_regulation_object`

Engine regulation object.

### tyre `string`

Name of the tyre manufacturer.

### length `double || null`

Length of the car if available.

### width `double || null`

Width of the car if available.

### height `double || null`

Height of the car if available.

### weight `double || null`

Weight of the car if available.

# Engine regulation object

## JSON data format

```json
{
  "id": string,
  "years": string[],
  "induction": string[],
  "number_of_pistons": int,
  "layout": string,
  "bank_angle": double || null,
  "max_displacement": double[],
  "rev_limit": int || null
}
```

## Fields

### id `string`

Unique id of that object.

### years `string[]`

List of years this regulation was in effect.

### induction `string[]`

Array of types of inductions that are allowed.
Possible values in array: `natural`, `forced`.

### number_of_pistons `int`

Number of pistons allowed.

### layout `string`

Engine piston layout.
Possible values: `I` (******Inline******), `V` (******V shape******).

### bank_angle `double || null`

Angle between banks of pistons. 
`null` if regulations didn’t specify the angle.

### max_displacement `double[]`

Array of maximum allowed displacement specified by regulations for each induction type 
specified in the `induction` array field.

### rev_limit `double || null`

Max engine revolution per minute. `null` if not specified by regulation.