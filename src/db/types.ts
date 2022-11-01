type Engine = {
  "id": string,
  "years": [string],
  "induction": [string],
  "number_of_pistons": number,
  "layout": string,
  "bank_angle": number | null,
  "max_displacement": [number],
  "rev_limit": number | null
}

type Car = {
  "id": string,
  "team": string,
  "year": string,
  "engine_regulation": string,
  "length": number | null,
  "width": number | null,
  "height": number | null,
  "weight": number | null,
  "tyre": string
}

export { Engine, Car };