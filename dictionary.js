require('dotenv').config();

const moment = require('moment');

// MODULE LIST
const ids = {
  AC: 'recw2CewBnjHwwWM8',
  CAL: 'recyW034tcw69aKYC',
  CC: 'recWazbvo5WpRRcuk',
  DC: 'recCqUD76t3dEO2gI',
  Digi: 'recVu9aVaQ8FNkINa',
  DIGITAL: 'recymAkoqWZwuZi5j',
  DRDSON: 'recTEZ4BKYh0fRgRI',
  DVSD: 'recIirPxzNy2Vgn2f',
  HP: 'recOdSV13GUIjUjgJ',
  HTS: 'recJfA1EuGNJQcNrH',
  HV: 'recgPZTjE2Z5I0pCb',
  IC: 'recPVDsDoyChV9Bwt',
  ICCAL: 'recKAkIRGWNVWLjce',
  ILIM: 'rec6Gh8E0WThB9pvr',
  Inductor: 'recSLVkwZlWJS5qCm',
  LCRMUX: 'recgUxDSw1SOINmET',
  MDM4: 'recIinaxfgHlpSir9',
  'MDM-BP': 'recpA2nlz5LAtPwWc',
  Nano: 'recV2gj4moPeQgIXi',
  PG: 'reca7fTvS1TIlySLu',
  QGCAL: 'recwWyZ9tBYX06QcB',
  QVI: 'rec3lyFDpv3nC0wda',
  RG: 'recB08omBoOvdvyKT',
  RGCAL: 'rec8TOTP9OJpF74NU',
  THM: 'recuHgEeIEYyTSYBj',
  TMU: 'recag6aPpQVsuFRvF',
  UHV: 'recwV1LltXmLSLkcK',
};
module.exports.ids = ids;

// DATE VARIABLES
const date = {
  system: moment().format('MMDDYY'),
  standard: moment().format('YYYY-MM-DD'),
};
module.exports.date = date;

// CREATE SYSTEMS FOR WORK ORDERS
const makeSystem = (category, letter, recordID) => {
  const object = {
    fields: {
      'System #': `${letter}???-${date.system}`,
      Category: category,
      'Date Created': date.standard,
      'Work Orders': [recordID],
      Status: 'In Queue',
    },
  };
  return object;
};
module.exports.makeSystem = makeSystem;
