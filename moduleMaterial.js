// This function checks the Work Orders table in the DEV_No_Material_Status
// (only shows orders without a Material Status link)
// and links to the correct module

// Setting up the Airtable API & attaching to the Manufacturing base
const Airtable = require('airtable');

const dict = require('./dictionary.js');

const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base('applAD5LWwZD4ymTP');

// Setting variables
const update = {};

base('Module Log').select({
  filterByFormula: 'OR({Material Status} = "", {Module} = "")',
}).firstPage((err, records) => {
  if (err) {
    console.error(err);
    return;
  }
  records.forEach((record) => {
    if (record.get('Module') == undefined) {
      const name = record.get('Name').split(' ')
      update['Module'] = name[0];
      update['Material Status'] = [dict.ids[name[0]]];
    } else {
      update['Material Status'] = [dict.ids[record.get('Module')]];
    }

    base('Module Log').update(record.id, update, (error) => {
      if (error) {
        console.error(error);
      }
    });

    console.log(`Modified ${record.get('Name')} (${record.id})`);
  });
});


// NEED TO CHECK FOR NO "MODULE" SET
