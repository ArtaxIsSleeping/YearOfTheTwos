const startVolM3 = 3.4176e-13;
const startMassG = 0.32465e-6;

const dayRange = document.getElementById('day-range');
const dayInput = document.getElementById('day-input');
const dateOut = document.getElementById('date-out');
const weeksOut = document.getElementById('weeks-out');

const standardNumFormatRules = [
  { under: 10, fractionDigits: 3 },
  { under: 1000, fractionDigits: 2 },
  { under: Infinity, fractionDigits: 0 },
];
const standardNumFormatGetter = ua => {
  const rules = findFirst(standardNumFormatRules, r => ua < r.under);
  return {
    minimumFractionDigits: rules.fractionDigits,
    maximumFractionDigits: rules.fractionDigits,
  };
};

const illions = [
  { solo: 'm', ones: 'un', tens: 'dec' },
  { solo: 'b', ones: 'duo', tens: 'vigint' },
  { solo: 'tr', ones: 'tre', tens: 'trigint' },
  { solo: 'quadr', ones: 'quattuor', tens: 'quadragint' },
  { solo: 'quint', firstOnes: 'quin', ones: 'quinqua', tens: 'quinquagint' },
  { solo: 'sext', firstOnes: 'sex', ones: 'ses', tens: 'sexagint' },
  { solo: 'sept', ones: 'septen', tens: 'septuagint' },
  { solo: 'oct', ones: 'octo', tens: 'octogint' },
  { solo: 'non', ones: 'novem', tens: 'nonagint' },
];
function getIllion(amount) {
  const orders = Math.floor(Math.log10(amount) / 3);
  if (orders <= 1) return null;
  
  let name = 'illion';
  const latinNumber = orders - 1;
  if (latinNumber >= 10) {
    const tensIndex = Math.floor(latinNumber / 10) - 1;
    const onesIndex = (latinNumber % 10) - 1;
    name = illions[tensIndex].tens + name;
    if (onesIndex >= 0) {
      const onesIllion = illions[onesIndex];
      const onesName = (tensIndex === 0 ? onesIllion.firstOnes : null) || onesIllion.ones;
      name = onesName + name;
    }
  } else {
    const onesIndex = (latinNumber % 10) - 1;
    name = illions[onesIndex].solo + name;
  }
  
  // Parsing here is actually more precise than pow
  const scale = parseFloat('1e' + (orders * 3));
  
  return { name, scale };
}

class MetricDisplay {
  constructor(baseId, {units, extraUnits=[], facts=[]}) {
    const baseEl = document.getElementById(baseId);

    this.amountOut = baseEl.querySelector('.amount');
    this.factNameOut = baseEl.querySelector('.fact-name');
    this.factSizeOut = baseEl.querySelector('.fact-size');

    this.units = units;
    this.extraUnits = extraUnits;
    this.facts = facts;
  }
  
  static selectIllionedUnit(amount, units, defaultUnit) {
    const unit = findLast(units, u => amount / u.scale >= 1, defaultUnit);
    if (!unit) return null;
    
    const unitAmount = amount / unit.scale;
    const illion = getIllion(unitAmount);
    if (illion) {
      return {
        name: illion.name + ' ' + unit.name,
        scale: illion.scale * unit.scale,
      };
    } else {
      return unit;
    }
  }
  
  static formatWithUnit(amount, unit, numFormatGetter) {
    const unitAmount = amount / unit.scale;
    const numFormat = numFormatGetter(unitAmount);
    return `${unitAmount.toLocaleString([], numFormat)} ${unit.name}`;
  }
  
  static formatWithExtra(amount, unit, extraUnit, numFormatGetter) {
    const formatted = MetricDisplay.formatWithUnit(amount, unit, numFormatGetter);
    if (extraUnit) {
      const extraFormatted = MetricDisplay.formatWithUnit(amount, extraUnit, numFormatGetter);
      return `${formatted} (${extraFormatted})`;
    } else {
      return formatted;
    }
  }

  display(amount) {
    const unit = MetricDisplay.selectIllionedUnit(amount, this.units, this.units[0]);
    const extraUnit = MetricDisplay.selectIllionedUnit(amount, this.extraUnits, null);
    this.amountOut.innerText = MetricDisplay.formatWithExtra(amount, unit, extraUnit, standardNumFormatGetter);
    const fact = findMin(this.facts, f => Math.abs(amount - f.scale));
    if (fact) {
      this.factNameOut.innerText = fact.name;
      this.factSizeOut.innerText = MetricDisplay.formatWithExtra(fact.scale, unit, extraUnit, () => ({
        minimumSignificantDigits: fact.sigFigs,
        maximumSignificantDigits: fact.sigFigs,
      }));
    }
  }
}

const LY = 9460730472580800;

const diamDisplay = new MetricDisplay('diam-out', {
  units: [
    { scale: 1e-6, name: 'microns' },
    { scale: 1e-3, name: 'millimeters' },
    { scale: 1e-2, name: 'centimeters' },
    { scale: 1e+0, name: 'meters' },
    { scale: 1e+3, name: 'kilometers' },
  ],
  extraUnits: [
    { scale: LY, name: 'light years' },
  ],
  facts: [
    { scale: 70e-6, name: 'Width of a human hair', sigFigs: 1 },
    { scale: 760e-6, name: 'Thickness of a credit card', sigFigs: 2 },
    { scale: 1.4e-3, name: 'Width of a thumbnail', sigFigs: 2 },
    { scale: 42.75e-3, name: 'Width of a full size keyboard', sigFigs: 2 },
    { scale: 1.75, name: 'Height of Michael Jackson', sigFigs: 3 },
    { scale: 48, name: 'Height of the Colosseum', sigFigs: 2 },
    { scale: 189, name: 'Width of the Colosseum', sigFigs: 3 },
    { scale: 324, name: 'Height of the Eiffel Tower', sigFigs: 3 },
    { scale: 2.737e3, name: 'Length of the Golden Gate Bridge', sigFigs: 4 },
    { scale: 8849, name: 'Elevation at the top of Mount Everest', sigFigs: 2 },
    { scale: 240e3, name: 'Widest part of the English Channel', sigFigs: 2 },
    { scale: 3474.8e3, name: 'Diameter of the moon', sigFigs: 5 },
    { scale: 12742e3, name: 'Diameter of the Earth', sigFigs: 5 },
    { scale: 384400e3, name: 'Distance from the Earth to the moon', sigFigs: 4 },
    { scale: 1.3927e9, name: 'Diameter of the sun', sigFigs: 5 },
    { scale: 149597870700, name: 'Distance from the Earth to the sun', sigFigs: 5 },
    { scale: 287527107485400, name: 'Diameter of the solar system', sigFigs: 4 },
    { scale: 4.246*LY, name: 'Distance to Proxima Centauri', sigFigs: 4 },
    { scale: 105700*LY, name: 'Diameter of the Milky Way', sigFigs: 4 },
    { scale: 2.9e6*LY, name: 'Distance to the Andromeda Galaxy', sigFigs: 2 },
    { scale: 65.23e6*LY, name: 'Distance to the Virgo Cluster', sigFigs: 4 },
    { scale: 93.016e9*LY, name: 'Diameter of the observable universe', sigFigs: 5 },
  ],
});
const volDisplay = new MetricDisplay('vol-out', {
  units: [
    { scale: 1e-18, name: 'cubic microns' },
    { scale: 1e-9, name: 'cubic millimeters' },
    { scale: 1e-6, name: 'cubic centimeters' },
    { scale: 1e+0, name: 'cubic meters' },
    { scale: 1e+9, name: 'cubic kilometers' },
  ],
});
const massDisplay = new MetricDisplay('mass-out', {
  units: [
    { scale: 1e-6, name: 'micrograms' },
    { scale: 1e-3, name: 'milligrams' },
    { scale: 1e+0, name: 'grams' },
    { scale: 1e+3, name: 'kilograms' },
    { scale: 1e+6, name: 'metric tons' },
  ],
  facts: [
    { scale: 13e-3, name: 'Grain of sand', sigFigs: 2 },
    { scale: 4.5, name: 'Sheet of A4 paper', sigFigs: 2 },
    { scale: 62e3, name: 'Michael Jackson', sigFigs: 2 },
    { scale: 1.249e6, name: '2003 Honda Civic', sigFigs: 4 },
    { scale: 26700e6, name: 'Sydney Opera House', sigFigs: 3 },
    { scale: 162000e12, name: 'Mount Everest', sigFigs: 3 },
    { scale: 73459e21, name: 'The Moon', sigFigs: 5 },
    { scale: 5970000e21, name: 'The Earth', sigFigs: 3 },
    { scale: 1898e27, name: 'Jupiter', sigFigs: 4 },
    { scale: 1.98892e33, name: 'The Sun', sigFigs: 5 },
    { scale: 8.552356e39, name: 'The Milky Way\'s supermassive black hole', sigFigs: 2 },
    { scale: 3.00128028e55, name: 'The observable universe', sigFigs: 2 },
  ],
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
