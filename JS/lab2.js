const apiServerAddress = 'https://localhost:5001';

function getAgeRestrictionId(ARCode) {
  fetch(`${apiServerAddress}/api/Anime/GetAgeRestrictionId?ageRestrictionCode=${ARCode}`)
    .then((response) => response.json()).then((data) => { document.getElementById('endpoint1').innerHTML = `ARId: ${data}`; });
}

function getAllGenres() {
  fetch(`${apiServerAddress}/api/Anime/GetAllGenres`)
    .then((response) => response.json()).then((data) => {
      let dataToDisplay = 'Retrieved genres are: ';
      data.forEach((element) => {
        dataToDisplay += element.name;
      });
      document.getElementById('endpoint2').innerHTML = dataToDisplay;
    });
}

function createLiElement(liText) {
  const newLi = document.createElement('li');
  newLi.innerHTML = liText;
  document.getElementById('endpoint3').appendChild(newLi);
}

function getRandomAnime() {
  fetch(`${apiServerAddress}/api/Anime/GetRandomAnime`)
    .then((response) => response.json()).then((data) => {
      createLiElement(data.id);
      createLiElement(data.title);
      createLiElement(data.rating);
      createLiElement(data.year);
      createLiElement(data.episodes);
    });
}

getAgeRestrictionId('G');
getAllGenres();
getRandomAnime();
