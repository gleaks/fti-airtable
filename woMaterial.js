// This function checks the Work Orders table in the DEV_No_Material_Status
// (only shows orders without a Material Status link)
// and links to the correct module

const Airtable = require('airtable');

require('./dictionary.js');

const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base('applAD5LWwZD4ymTP');

base('Work Orders').select({
  filterByFormula: `OR(AND(NOT({Material Status - Speculative} = ""), {Type} = "Confirmed"),
                    AND(NOT({Material Status - Speculative} = ""), {Type} = "Transfer"),
                    AND(NOT({Material Status - Confirmed} = ""), {Type} = "Possible"),
                    AND({Material Status - Speculative} = "", {Material Status - Confirmed} = ""))`,
}).firstPage((err, records) => {
  if (err) {
    console.error(err);
    return;
  }
  records.forEach((record) => {
    const update = {};

    if ((record.get('Type') === 'Confirmed' || record.get('Type') === 'Transfer')) {
      update['Material Status - Confirmed'] = ['recm5lK6Ms2C8ZBpA'];
      update['Material Status - Speculative'] = [];
    }
    if (record.get('Type') === 'Possible') {
      update['Material Status - Speculative'] = ['recCDiR3Sp52HJ170'];
      update['Material Status - Confirmed'] = [];
    }

    base('Work Orders').update(record.id, update, (error) => {
      if (error) {
        console.error(error);
      }
    });

    console.log(`Modified ${record.get('Name')} (${record.id})`);
  });
});
