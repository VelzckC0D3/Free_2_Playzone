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

const invAPI = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/uX47mGCyQ3QN2ImlxrQR';

const likeGame = async (id) => {
  const API_URL = `${invAPI}/likes`;
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      item_id: id,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
};

const getLikes = async () => {
  const API_URL = `${invAPI}/likes`;
  const res = await fetch(API_URL);
  const data = await res.json();
  const objetc1 = {};
  data.forEach((element) => {
    objetc1[element.item_id] = element.likes !== undefined ? element.likes : 0;
  });
  return objetc1;
};

const addComment = async (id, comment) => {
  const API_URL = `${invAPI}/comments`;
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      item_id: id,
      username: 'Anonymous',
      comment,
    }),
  });
  return response.json();
};

const getComments = async (id) => {
  const API_URL = `${invAPI}/comments?item_id=${id}`;
  const response = await fetch(API_URL);
  return response.json();
};

getComments(10)
  .then((comments) => {
    console.log(comments);
  })
  .catch((error) => {
    console.log(error);
  });

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
const likes = {};

const createGameCardHTML = (game, index) => `
  <div class="game-card">
    <img class="game-img" src="${game.thumbnail}" alt="${game.title}" />
    <h2 class="game-title">${game.title}</h2>
    <p class="game-desc">${game.short_description.slice(0, 200)}${game.short_description.length > 200 ? '...' : ''}</p>
    <div class="game-actions">
      <a class="game-link" href="${game.game_url}" target="_blank">Play Now!</a>
      <button id="like-btn-${index}" class="like-btn">❤️</button>
      <span id="likes-count-${index}" class="likes-count">Likes for game ${game.id}: ${likes[game.id]}</span>
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
        <input class="userInput" type="text" placeholder="Guest" /><br>
        <input class="commentInput" type="text" placeholder="Add a new comment" /><br>
        <button type="submit">Submit</button>
        </form>     
        
        

        <button type="button" class="close-btn btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
`;

const renderGameCards = async (games) => {
  const likes = await getLikes();

  games.forEach((game, index) => {
    const gameCardHTML = createGameCardHTML(game, index);
    gameCardsElement.insertAdjacentHTML('beforeend', gameCardHTML);

    const span = document.querySelector(`#likes-count-${index}`);
    span.textContent = `${likes[game.id]} likes`;

    const likeBtn = document.querySelector(`#like-btn-${index}`);
    likeBtn.addEventListener('click', async () => {
      const gameId = game.id;
      await likeGame(gameId);
      const updatedLikes = await getLikes();
      span.textContent = `${updatedLikes[gameId]} likes`;
    });
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