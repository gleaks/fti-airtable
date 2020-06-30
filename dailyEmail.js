var Airtable = require('airtable');
var base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY
}).base('applAD5LWwZD4ymTP');

ids = {
  recYPGyUIaOX9p2Ky: 'gareth',
  recUs9lkop9Xvl31a: 'glenn',
  rec4oQKJNK4WzYu0r: 'noah',
}
gareth = {
  email: 'gareth@focusedtest.com',
  tasks: {
    overdue: [],
    today: [],
    rest: []
  }
};
glenn = {
  email: 'glenn@focusedtest.com',
  tasks: {
    overdue: [],
    today: [],
    rest: []
  }
};
noah = {
  email: 'noah@focusedtest.com',
  tasks: {
    overdue: [],
    today: [],
    rest: []
  }
};

base('MFG Tasks').select({
  view: 'DEV_email'
}).firstPage(function(err, records) {
  if (err) {
    console.error(err);
    return;
  }
  records.forEach(function(record) {

    // Find the person variable, using the Node global object, by correlating the assigned ID from airtable to the javascript ids object
    name = global[ids[record.get('Assigned')[0]]];
    taskCategory = name.tasks[record.get('Email Category')]
    task = {
      name: record.get('Name'),
      id: record.id,
      url: `https://airtable.com/tblmPt3iJPcXXYUo5/viwzOghcYgnynrp9R/${record.id}?blocks=hide`,
      date: record.get('Expected Update'),
      status: record.get('Status'),
      type: record.get('Type')
    }
    taskCategory.push(task);
  });

  for (var val in ids) {
    name = global[ids[val]];
    html = 'Dear, ' + name.email
    for (var category in name.tasks) {
      if (category = 'overdue') categoryName = 'Overdue';
      if (category = 'today') categoryName = 'Due Today';
      if (category = 'rest') categoryName = 'Rest of the Week';
      html += `<h3>${categoryName}</h3><table>`
      name.tasks[category].forEach(function(task) {
        html += `<tr><td>${task.name}</td></tr>`
      });
      html += '</table>'
    }
    console.log(html);
  }
});
