import './style.css';
import 'bootstrap';

const gameCardsElement = document.querySelector('#game-cards');
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '16a429eb7fmshb30918cd461ee6dp1673e1jsn62d7843ea7e3',
    'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
  },
};

const fetchData = () => new Promise((resolve, reject) => {
  fetch(
    'https://free-to-play-games-database.p.rapidapi.com/api/filter?tag=3d.mmorpg.fantasy.pvp&platform=pc',
    options,
  )
    .then((response) => response.json())
    .then((data) => {
      resolve(data);
    })
    .catch((err) => reject(err));
});

const createGameCardHTML = (game, index) => `
  <div class="game-card">
    <img class="game-img" src="${game.thumbnail}" alt="${game.title}" />
    <h2 class="game-title">${game.title}</h2>
    <p class="game-desc">${game.short_description}</p>
    <div class="game-actions">
      <a class="game-link" href="${game.game_url}" target="_blank">Play Now!</a>
      <button class="like-btn">❤️</button>
      <button type="button" class="comments-btn" data-bs-toggle="modal" data-bs-target="#exampleModal-${index}">Comments</button>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="exampleModal-${index}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">${game.title}</h5>
        <button type="button" class="btn-close btn-close-white btn-light" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <img src="${game.thumbnail}" alt="" aria-label="">
        <img class="modal-img" src="" alt="">
          <h2 class="modal-title"></h2>
          <div class="modal-info">
          <div class="modal-platform"><span class="span">Platform:</span> ${game.platform}</div>
          <div class="modal-developer"><span class="span">Developer:</span> ${game.developer}</div>
          <div class="modal-genre"><span class="span">Genre:</span> ${game.genre}</div>
          <div class="modal-publisher"><span class="span">Publisher:</span> ${game.publisher}</div>
      </div>
        </div>
        <div class="modal-footer">
        <div class="modal-comments">
        <h5 class="comments-tittle">Comments</h5>
        <div class="comments"> HERE ARE GOING TO BE THE COMMENTS </comments>
        </div>


        
        <form id="add-comment">
        <input class="commentInput" type="text" placeholder="Add a new comment" />
        <button type="submit">Submit</button>
        </form>     
        
        

        <button type="button" class="close-btn btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
`;

const renderGameCards = (games) => {
  games.forEach((game, index) => {
    const gameCardHTML = createGameCardHTML(game, index);
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
