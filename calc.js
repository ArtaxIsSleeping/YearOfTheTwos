const startVolM3 = 3.4176e-13;
const startMassG = 0.32465e-6;

const dayRange = document.getElementById('day-range');
const dayInput = document.getElementById('day-input');
const dateOut = document.getElementById('date-out');
const weeksOut = document.getElementById('weeks-out');

const numFormatRules = [
  { under: 10, fractionDigits: 3 },
  { under: 1000, fractionDigits: 2 },
  { under: Infinity, fractionDigits: 0 },
];

const illions = [
  { scale: 1e6, name: 'million' },
  { scale: 1e12, name: 'trillion' },
  { scale: 1e18, name: 'quintillion' },
  { scale: 1e21, name: 'sextillion' },
  { scale: 1e27, name: 'octillion' },
  { scale: 1e33, name: 'decillion' },
  { scale: 1e39, name: 'duodecillion' },
  { scale: 1e45, name: 'quattuordecillion' },
];

class MetricDisplay {
  constructor(baseId, {units, facts}) {
    const baseEl = document.getElementById(baseId);

    this.amountOut = baseEl.querySelector('.amount');
    this.factNameOut = baseEl.querySelector('.fact-name');
    this.factSizeOut = baseEl.querySelector('.fact-size');

    this.units = units;
    this.facts = facts;
  }

  display(amount) {
    const unit = findLast(this.units, u => amount / u.scale >= 1, this.units[0]);
    let unitAmount = amount / unit.scale;
    let unitName = unit.name;
    const illion = findLast(illions, i => unitAmount > i.scale);
    if (illion) {
      unitAmount /= illion.scale;
      unitName = illion.name + ' ' + unitName;
    }
    const numRules = findFirst(numFormatRules, r => unitAmount < r.under);
    this.amountOut.innerText = `${unitAmount.toLocaleString([], {
      minimumFractionDigits: numRules.fractionDigits,
      maximumFractionDigits: numRules.fractionDigits,
    })} ${unitName}`;

    if (this.facts) {
      const fact = findMin(this.facts, f => Math.abs(amount - f.scale));
      this.factNameOut.innerText = fact.name;
      this.factSizeOut.innerText = fact.size;
    }
  }
}

const AU = 149597870700;
const LY = 9460730472580800;
const PC = 3.0856775814913673e16;

const SM = 1.98892e33;

const diamDisplay = new MetricDisplay('diam-out', {
  units: [
    { scale: 1e-6, name: 'microns' },
    { scale: 1e-3, name: 'millimeters' },
    { scale: 1e-2, name: 'centimeters' },
    { scale: 1e+0, name: 'meters' },
    { scale: 1e+3, name: 'kilometers' },
    { scale: AU, name: 'astronomical units' },
    { scale: LY, name: 'light years' },
    // { scale: PC, name: 'parsecs' },
    { scale: 1e6*PC, name: 'megaparsecs' },
    { scale: 1e9*PC, name: 'gigaparsecs' },
    { scale: 1e12*PC, name: 'teraparsecs' },
    { scale: 1e15*PC, name: 'petaparsecs' },
  ],
  facts: [
    { scale: 100e-6, name: 'Width of a human hair', size: 'about 70 microns' },
    { scale: 760e-6, name: 'Thickness of a credit card', size: 'about 760 microns' },
    { scale: 1.4e-3, name: 'Width of a thumbnail', size: 'about 1.4 centimeters' },
    { scale: 42.75e-3, name: 'Width of a full size keyboard', size: 'about 42.75 centimeters' },
    { scale: 1.75, name: 'Height of Michael Jackson', size: '1.75 meters' },
    { scale: 48, name: 'Height of the Colosseum', size: '48 meters' },
    { scale: 189, name: 'Width of the Colosseum', size: '189 meters' },
    { scale: 324, name: 'Height of the Eiffel Tower', size: '324 meters' },
    { scale: 2.737e3, name: 'Length of the Golden Gate Bridge', size: '2.737 kilometers' },
    { scale: 8849, name: 'Elevation at the top of Mount Everest', size: '8.8 kilometers' },
    { scale: 240e3, name: 'Widest part of the English Channel', size: '240 kilometers' },
    { scale: 3474.8e3, name: 'Diameter of the moon', size: '3,474.8 kilometers' },
    { scale: 12742e3, name: 'Diameter of the Earth', size: '12,742 kilometers' },
    { scale: 384400e3, name: 'Distance from the Earth to the moon', size: '384,400 kilometers' },
    { scale: 1.3927e9, name: 'Diameter of the sun', size: '1.3927 million kilometers' },
    { scale: AU, name: 'Distance from the Earth to the sun', size: '1 astronomical unit' },
    { scale: 1922*AU, name: 'Diameter of the solar system', size: '1,922 astronomical units' },
    { scale: 4.246*LY, name: 'Distance to Proxima Centauri', size: '4.246 light years' },
    { scale: 105700*LY, name: 'Diameter of the Milky Way', size: '105,700 light years' },
    { scale: 2.9e6*LY, name: 'Distance to the Andromeda Galaxy', size: '2.9 million light years' },
    { scale: 16.5e6*PC, name: 'Distance to the Virgo Cluster', size: '16.5 megaparsecs' },
    { scale: 28.5e9*PC, name: 'Diameter of the observable universe', size: '28.5 gigaparsecs' },
  ]
});
const volDisplay = new MetricDisplay('vol-out', {
  units: [
    { scale: 1e-18, name: 'cubic micrometers' },
    { scale: 1e-9, name: 'cubic millimeters' },
    { scale: 1e-6, name: 'cubic centimeters' },
    { scale: 1e+0, name: 'cubic meters' },
    { scale: 1e+9, name: 'cubic kilometers' },
    { scale: AU**3, name: 'cubic astronomical units' },
    { scale: LY**3, name: 'cubic light years' },
    { scale: (1e6*PC)**3, name: 'cubic megaparsecs' },
    { scale: (1e9*PC)**3, name: 'cubic gigaparsecs' },
    { scale: (1e12*PC)**3, name: 'cubic teraparsecs' },
  ],
});
const massDisplay = new MetricDisplay('mass-out', {
  units: [
    { scale: 1e-6, name: 'micrograms' },
    { scale: 1e-3, name: 'milligrams' },
    { scale: 1e+0, name: 'grams' },
    { scale: 1e+3, name: 'kilograms' },
    { scale: 1e+6, name: 'metric tons' },
    { scale: 1e+21, name: 'metric petatons' },
    { scale: SM, name: 'solar masses' },
    { scale: 1e6*SM, name: 'mega-solar masses' },
    { scale: 1e9*SM, name: 'giga-solar masses' },
    { scale: 1e12*SM, name: 'tera-solar masses' },
    { scale: 1e15*SM, name: 'peta-solar masses' },
    { scale: 1e18*SM, name: 'exa-solar masses' },
    { scale: 1e21*SM, name: 'zetta-solar masses' },
    { scale: 1e24*SM, name: 'yotta-solar masses' },
  ],
  facts: [
    { scale: 13e-3, name: 'Grain of sand', size: '13 milligrams' },
    { scale: 4.5, name: 'Sheet of A4 paper', size: '4.5 grams' },
    { scale: 62e3, name: 'Michael Jackson', size: '62 kilograms' },
    { scale: 1.249e6, name: '2003 Honda Civic', size: '1.249 metric tons' },
    { scale: 26700e6, name: 'Sydney Opera House', size: '26,700 metric tons' },
    { scale: 162000e12, name: 'Mount Everest', size: '162,000 million metric tons' },
    { scale: 73459e21, name: 'The moon', size: '73,459 metric petatons' },
    { scale: 5970000e21, name: 'The Earth', size: '5.97 million metric petatons' },
    { scale: 1898e27, name: 'Jupiter', size: '1,898 million metric petatons' },
    { scale: SM, name: 'The Sun', size: '1 solar mass' },
    { scale: 4.3e6*SM, name: 'The Milky Way\'s supermassive black hole', size: '4.3 million solar masses' },
    { scale: 15.09e21*SM, name: 'The observable universe', size: '15 sextillion solar masses' },
    { scale: 12.27e24*1e45*SM, name: '818,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000 times the mass of the observable universe', size: '12.27 quattuordecillion yotta-solar masses' },
  ]
});

function findMin(items, keyGetter, defaultValue=null) {
  let minKey = Infinity;
  let minItem = defaultValue;
  for (const item of items) {
    const key = keyGetter(item);
    if (key <= minKey) {
      minKey = key;
      minItem = item;
    }
  }
  return minItem;
}

function findFirst(items, predicate, defaultValue=null) {
  for (const item of items) {
    if (predicate(item)) {
      return item;
    }
  }
  return defaultValue;
}

function findLast(items, predicate, defaultValue=null) {
  for (let i = items.length - 1; i >= 0; i--) {
    if (predicate(items[i])) {
      return items[i];
    }
  }
  return defaultValue;
}

function diamFromVol(v) {
  return Math.cbrt(6 * v / Math.PI);
}

function afterDays(start, days) {
  return start * 2**days;
}

function withPlural(amount, single, plural) {
  return amount + ' ' + (amount === 1 ? single : plural);
}

function updateOutputs(day) {
  day = Math.max(0, Math.min(365, +day));
  dayRange.value = day;
  dayInput.value = day;

  const daysFromStart = day - 1;
  const weeksFromStart = Math.floor(daysFromStart / 7);
  const dayOfWeek = daysFromStart % 7;

  dateOut.innerText = new Date(2022, 0, day).toLocaleString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let weeksFormatted;
  if (daysFromStart > 0) {
    weeksFormatted = 'After ';
    if (weeksFromStart) {
      weeksFormatted += withPlural(weeksFromStart, 'Week', 'Weeks');
      if (dayOfWeek) {
        weeksFormatted += ', ';
      }
    }
    if (dayOfWeek) {
      weeksFormatted += withPlural(dayOfWeek, 'Day', 'Days');
    }
  } else if (daysFromStart < 0) {
    weeksFormatted = withPlural(-dayOfWeek, 'Day', 'Days') + ' Before';
  } else {
    weeksFormatted = 'On the First Day';
  }
  weeksOut.innerText = weeksFormatted;

  const volM3 = afterDays(startVolM3, day);
  const diamM = diamFromVol(volM3);
  const massG = afterDays(startMassG, day);

  diamDisplay.display(diamM);
  volDisplay.display(volM3);
  massDisplay.display(massG);
}

function dayOfYear(now) {
  const date = (now == undefined) ? new Date() : new Date(now);
  const year = date.getYear();
  let sum = 0;
  do {
    sum += date.getDate();
    date.setDate(0);
  } while (date.getYear() === year);
  return sum;
}

dayRange.addEventListener('input', e => {
  updateOutputs(+dayRange.value);
});
dayInput.addEventListener('change', e => {
  updateOutputs(+dayInput.value);
});
dayInput.addEventListener('wheel', e => {
  updateOutputs(+dayInput.value - Math.sign(e.deltaY));
  e.preventDefault();
});

updateOutputs(dayOfYear());
