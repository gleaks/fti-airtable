// Designed by Gareth Leak
// LOOK UP RECORDS IN THE MODULE LOG THAT DO NOT HAVE A MATERIAL STATUS OR MODULE SET
// AND AUTOMATICALLY SET THEM

// Setting up the Airtable API
const Airtable = require('airtable');
// Custom functions
const dict = require('./dictionary.js');
// Attaching the Airtable API to the Manufacturing Base on Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base('applAD5LWwZD4ymTP');

// Create an object that gets built later to update each record
const update = {};
// Select the table and use an Airtable formula to filter the results we want
base('Module Log').select({
  filterByFormula: 'OR({Material Status} = "", {Module} = "")',
}).firstPage((err, records) => {
  if (err) {
    console.error(err);
    return;
  }
  records.forEach((record) => {
    // If the Module column has not been set
    if (record.get('Module') == undefined) {
      // Split the Name column by a space
      const name = record.get('Name').split(' ')
      // Add an update to the Module column to set it as the 1st part of the split name
      update['Module'] = name[0];
      // Add an update to the Material Status column to set it the same as the Module column
      update['Material Status'] = [dict.ids[name[0]]];
    } else {
      // The Module column has already been set, so update Material Status straight from that
      update['Material Status'] = [dict.ids[record.get('Module')]];
    }
    // Actually run the Airtable update with our fully built update object
    base('Module Log').update(record.id, update, (error) => {
      if (error) {
        console.error(error);
      }
    });

    console.log(`Modified ${record.get('Name')} (${record.id})`);
  });
});
