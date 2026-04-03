const fs = require('fs');
fetch('https://api.battlemetrics.com/servers?filter[search]=65.21.137.238')
  .then(res => res.json())
  .then(data => {
    let servers = data.data.filter(s => s.attributes.ip === "65.21.137.238");
    console.log("Servers found using IP search:", servers.length);
    servers.forEach(s => console.log(s.attributes.name));
  });
