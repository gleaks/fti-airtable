// This function checks the Work Orders table in the DEV_No_Material_Status
// (only shows orders without a Material Status link)
// and links to the correct module

// Import the Airtable API
const Airtable = require('airtable');

// This is a dictionary containing dates & other useful stuff
const dict = require('./dictionary.js');

// Connect to the Airtable using our API key (should be stored in ENV for security)
const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base('applAD5LWwZD4ymTP');

// Open our table and only look for records that are Confirmed, not Complete & have no Systems
base('Work Orders').select({
  filterByFormula: 'AND({Order Systems} = "", NOT({Status} = "Complete"), {Type} = "Confirmed")',
}).firstPage((err, records) => {
  if (err) {
    console.error(err);
    return;
  }
  // Iterate over every record we found
  records.forEach((record) => {
    // This is the array that will ultimately be used to create all the systems
    const systems = [];
    // Requirement String is a comma seperated string of modules
    const rs = record.get('Requirement String');
    // If the string contains AC, DC or IC we know it needs a testhead
    if (rs.includes('AC') || rs.includes('DC') || rs.includes('IC')) {
      // Fill in the rest of the system object then push it into our array
      systems.push(dict.makeSystem('Testhead', 'A', record.id));
      console.log(systems);
    }
    // If the string contains CAL it needs a cal box
    if (rs.includes('CAL')) {
      systems.push(dict.makeSystem('CAL', 'C', record.id));
      console.log(systems);
    }
    if (rs.includes('DRDSON')) {
      systems.push(dict.makeSystem('DRDSON', 'DRD', record.id));
    }
    if (rs.includes('DXM')) {
      systems.push(dict.makeSystem('DXM', 'D', record.id));
    }
    if (rs.includes('HTS')) {
      systems.push(dict.makeSystem('HTS', 'H', record.id));
    }
    if (rs.includes('IND')) {
      systems.push(dict.makeSystem('Inductor', 'IND', record.id));
    }
    if (rs.includes('MDM')) {
      systems.push(dict.makeSystem('MDM', 'M', record.id));
    }
    // QG CAL
    if (rs.includes('QC')) {
      systems.push(dict.makeSystem('QG-CAL', 'Q', record.id));
    }
    // RG CAL
    if (rs.includes('CG')) {
      systems.push(dict.makeSystem('RG-CAL', 'R', record.id));
    }
    // UHV
    if (rs.includes('ULTRA')) {
      systems.push(dict.makeSystem('UHV', 'U', record.id));
    }

    console.log(`Modified ${record.get('Name')} (${record.id})`);
    console.log(systems);

    // Now its time to build some systems
    base('System Log').create(systems, (error) => {
      if (error) {
        console.error(error);
      }
    });
  });
});
