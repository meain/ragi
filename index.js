const lpd = localStorage.lastPullDate;
if (lpd !== undefined) {
  let dateDiff = new Date() - new Date(lpd);
  console.log(dateDiff / 60000, "minutes since last pull.");
  // pull new gists only every minute (github rate limits to 60 per hour)
  if (dateDiff / 60000 > 10) {
    dispalayGist();
    fetchGists().then(cacheItem);
  } else {
    dispalayGist();
    cacheItem();
  }
} else {
  // fist time pull
  console.log("First time pull. Welcome to ragi!");
  fetchGists().then(() => {
    cacheItem().then(dispalayGist);
  });
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
      .catch((e) => {
        console.log(e);
        random.textContent = "Github rate limited! See you in some time 👋";
      });
  });
}

function cacheItem() {
  let singles = JSON.parse(localStorage.gistContents);
  const item = singles[Math.floor(Math.random() * (singles.length - 1))];
  return new Promise((resolve, reject) => {
    const file = item.files[Object.keys(item.files)[0]];
    fetch(file.raw_url)
      .then((d) => d.text())
      .then((d) => {
        localStorage.setItem("nextItem", JSON.stringify(item));
        localStorage.setItem("nextContent", d);
        console.log("Stored next item");
        resolve();
      });
  });
}

function dispalayGist() {
  let random = document.getElementById("random");
  let random_lang = document.getElementById("language");
  let random_name = document.getElementById("name");

  const item = JSON.parse(localStorage.nextItem);
  console.log(item);
  const file = item.files[Object.keys(item.files)[0]];
  const content = localStorage.nextContent;

  random.textContent = content;
  random_name.textContent = file.filename;
  random_lang.textContent = file.language;
  random_name.href = "https://gist.github.com/" + item.id;
}
