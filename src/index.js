import './style.css';

const gameCardsElement = document.querySelector('#game-cards');
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '16a429eb7fmshb30918cd461ee6dp1673e1jsn62d7843ea7e3',
    'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
  },
};

const fetchData = () => new Promise((resolve, reject) => {
  fetch('https://free-to-play-games-database.p.rapidapi.com/api/filter?tag=3d.mmorpg.fantasy.pvp&platform=pc', options)
    .then((response) => response.json())
    .then((data) => {
      resolve(data);
    })
    .catch((err) => reject(err));
});

const createGameCardHTML = (game) => `
  <div class="game-card">
    <img src="${game.thumbnail}" alt="${game.title}" />
    <h2>${game.title}</h2>
    <p>${game.short_description}</p>
    <a href="${game.game_url}" target="_blank">Play Now!</a>
    <button class="comments-btn">Comments</button>
  </div>
`;

const renderGameCards = (games) => {
  games.forEach((game) => {
    const gameCardHTML = createGameCardHTML(game);
    gameCardsElement.insertAdjacentHTML('beforeend', gameCardHTML);
  });
};

const handleFetchError = (err) => {
  console.error(err);
};

const init = () => {
  fetchData()
    .then((data) => {
      renderGameCards(data);
    })
    .catch(handleFetchError);
};

init();
