const lpd = localStorage.lastPullDate;
if (lpd !== undefined) {
  let dateDiff = new Date() - new Date(lpd);
  console.log(dateDiff / 60000, "minutes since last pull.");
  // pull new gists only every minute (github rate limits to 60 per hour)
  dispalayGist(dateDiff / 60000 > 10);
} else {
  // fist time pull
  localStorage.setItem("lastPullDate", Date());
  dispalayGist(true);
}

function dispalayGist(fetchNew) {
  if (fetchNew) {
    console.log("Pulling new entries.");
    fetch("https://api.github.com/gists")
      .then((d) => d.json())
      .then((d) => {
        let random = document.getElementById("random");
        let random_lang = document.getElementById("language");
        let random_name = document.getElementById("name");
        const singles = d.filter((o) => Object.keys(o.files).length === 1);
        localStorage.setItem("gistContents", JSON.stringify(singles));
        localStorage.setItem("lastPullDate", Date());
        const randomItem =
          singles[Math.floor(Math.random() * (singles.length - 1))];
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
      })
      .catch(() => {
        random.textContent = "Github rate limited! See you in some time 👋";
      });
  } else {
    let random = document.getElementById("random");
    let random_lang = document.getElementById("language");
    let random_name = document.getElementById("name");
    let singles = JSON.parse(localStorage.gistContents);
    const randomItem =
      singles[Math.floor(Math.random() * (singles.length - 1))];
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
}
