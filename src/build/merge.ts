import airports from '../../data/airports.json' with {type: 'json'}
import backhalf from '../../data/backhalf.json' with {type: 'json'}
import city from '../../data/city.json' with {type: 'json'}
import abbr2offset from '../../data/abbr2offset.json' with {type: 'json'}

console.log(
  JSON.stringify(
    {
      ...backhalf,
      ...city,
      ...airports,
      ...abbr2offset,
    },
    null,
    2,
  ),
)
