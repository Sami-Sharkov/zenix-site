const url = "https://api.battlemetrics.com/servers?filter[search]=zenix&page[size]=100";

fetch(url)
  .then(res => res.json())
  .then(data => {
    let servers = data.data.filter(s => s.attributes.ip === "65.21.137.238");
    console.log("Total Zenix servers on IP: " + servers.length);
    servers.forEach(s => console.log(`${s.attributes.id} - ${s.attributes.name} | connection port: ${s.attributes.port} | players: ${s.attributes.players}`));
  })
  .catch(err => console.error(err));
