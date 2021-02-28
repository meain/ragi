const lpd = localStorage.lastPullDate;
if (lpd !== undefined) {
  let dateDiff = new Date() - new Date(lpd);
  console.log(dateDiff / 60000, "minutes since last pull.");
  // pull new gists only every minute (github rate limits to 60 per hour)
  if (dateDiff / 60000 > 10) {
    dispalayGist();
    fetchGists();
  } else {
    dispalayGist();
  }
} else {
  // fist time pull
  console.log("First time pull. Welcome to ragi!");
  fetchGists.then(dispalayGist);
}

function fetchGists() {
  return new Promise((resolve, reject) => {
    console.log("Pulling new entries.");
    fetch("https://api.github.com/gists")
      .then((d) => d.json())
      .then((d) => {
        let random = document.getElementById("random");
        const singles = d.filter((o) => Object.keys(o.files).length === 1);
        localStorage.setItem("gistContents", JSON.stringify(singles));
        localStorage.setItem("lastPullDate", Date());
        resolve();
      })
      .catch(() => {
        random.textContent = "Github rate limited! See you in some time 👋";
      });
  });
}

function dispalayGist() {
  let random = document.getElementById("random");
  let random_lang = document.getElementById("language");
  let random_name = document.getElementById("name");
  let singles = JSON.parse(localStorage.gistContents);
  const randomItem = singles[Math.floor(Math.random() * (singles.length - 1))];
  console.log(randomItem);
  const randomFile = randomItem.files[Object.keys(randomItem.files)[0]];
  fetch(randomFile.raw_url)
    .then((d) => d.text())
    .then((d) => {
      random.textContent = d;
      random_name.textContent = randomFile.filename;
      random_lang.textContent = randomFile.language;
      random_name.href = "https://gist.github.com/" + randomItem.id;
    })
    .catch(() => {
      random.textContent = "Github rate limited! See you in some time 👋";
    });
}
