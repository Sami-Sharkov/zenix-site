const url = "https://api.battlemetrics.com/servers?filter[search]=zenix&filter[game]=ark";

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("Total servers found by name:", data.data ? data.data.length : 0);
    if(data.data && data.data.length > 0) {
      console.log(data.data.map(s => encodeURIComponent(s.attributes.name) + " " + s.attributes.ip + ":" + s.attributes.port));
    }
  })
  .catch(err => console.error(err));
