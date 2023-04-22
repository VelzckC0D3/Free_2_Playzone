/* eslint-disable no-useless-concat */
/* eslint-disable no-console */
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

const invAPI = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/Kksh8kGPsQh7xrD8jbYD';

const likeGame = async (id) => {
  const API_URL = `${invAPI}/likes`;
  return fetch(API_URL, {
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

const getComments = async (id) => {
  const API_URL = `${invAPI}/comments?item_id=${id}`;
  const response = await fetch(API_URL);
  return response.json();
};

const addComment = async (gameId, name, comment) => {
  const API_URL = `${invAPI}/comments`;
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      item_id: gameId,
      username: name,
      comment,
    }),
  });
  if (response.ok) {
    // Refresh comments
    getComments(gameId);
    return response;
  }
  throw new Error(`Request failed with status ${response.status}`);
};

getComments(8).then((comments) => {
  console.log(comments);
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
    <p class="game-desc">${game.short_description.slice(0, 200)}${
  game.short_description.length > 200 ? '...' : ''
}</p>
    <div class="game-actions">
      <a class="game-link" href="${game.game_url}" target="_blank">Play Now!</a>
      <button id="like-btn-${index}" class="like-btn">❤️</button>
      <span id="likes-count-${index}" class="likes-count">Likes for game ${
  game.id
}: ${likes[game.id]}</span>
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
          <div class="modal-platform"><span class="span">Platform:</span> ${
  game.platform
}</div>
          <div class="modal-developer"><span class="span">Developer:</span> ${
  game.developer
}</div>
          <div class="modal-genre"><span class="span">Genre:</span> ${
  game.genre
}</div>
          <div class="modal-publisher"><span class="span">Publisher:</span> ${
  game.publisher
}</div>
      </div>
        </div>
        <div class="modal-footer">
        <div class="modal-comments">
        <h5 class="comments-tittle">Comments</h5>
        <div class="comments-${game.id}">       
        </comments>
        </div>


        
        <form id="add-comment-${game.id}">
        <input class="userInput" type="text" placeholder="Guest" /><br>
        <input class="commentInput" type="text" placeholder="Add a new comment" /><br>
        <button class="submit-btn" type="submit">Submit</button>
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
    span.textContent = `${likes[game.id] ? likes[game.id] : 0} likes`;

    const likeBtn = document.querySelector(`#like-btn-${index}`);
    likeBtn.addEventListener('click', async () => {
      const gameId = game.id;
      await likeGame(gameId);
      const updatedLikes = await getLikes();
      span.textContent = `${updatedLikes[gameId]} likes`;
    });
  });
  const commentsBtn = document.querySelectorAll('.comments-btn');
  const disabled = false; // flag to keep track of whether the action is disabled or not

  commentsBtn.forEach((button, index) => {
    button.addEventListener('click', async () => {
      if (disabled) {
        return; // exit the function if the action is disabled
      }

      const commentsCont = document.querySelector('.comments-' + `${games[index].id}`);
      console.log(games[index].id);
      console.log(commentsCont);

      // Fetch comments for item
      const commentsResponse = await fetch(`${invAPI}/comments?item_id=${games[index].id}`);
      const commentsData = await commentsResponse.json();

      // Format comments data into HTML
      const commentsHTML = commentsData.map((comment) => `<ul class="commentsUl">
    <li class="comment-date"> ${comment.creation_date} </li>
    <li class="comment-user"> ${comment.username}: </li>
    <li class="comment-comment"> ${comment.comment} </li>
              </ul>`).join('');

      const newComment = document.createElement('div');
      newComment.innerHTML = commentsHTML;

      // Clear existing comments
      commentsCont.innerHTML = '';

      commentsCont.appendChild(newComment);
    });
  });

  let canSubmitComment = true;
  const submitBtn = document.querySelectorAll('.submit-btn');

  submitBtn.forEach((button, index) => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      if (!canSubmitComment) return;

      const form = button.closest('form');
      const name = form.querySelector('.userInput').value;
      const comment = form.querySelector('.commentInput').value;
      const gameId = games[index].id;

      if (name.trim() === '' || comment.trim() === '') {
        return;
      }

      canSubmitComment = false;
      setTimeout(() => {
        canSubmitComment = true;
      }, 5000); // wait 5 seconds before enabling comments again

      await addComment(gameId, name, comment);

      const commentsCont = document.querySelector('.comments-' + `${gameId}`);
      const commentsData = await getComments(gameId);
      const commentsHTML = commentsData.map((comment) => `<ul class="commentsUl">
      <li class="comment-date"> ${comment.creation_date} </li>
      <li class="comment-user"> ${comment.username}: </li>
      <li class="comment-comment"> ${comment.comment} </li>
    </ul>`).join('');
      commentsCont.innerHTML = commentsHTML;

      // clear the input fields
      form.querySelector('.userInput').value = '';
      form.querySelector('.commentInput').value = '';
    });
  });
};

const init = () => {
  fetchData().then((data) => {
    renderGameCards(data);
  });
};

init();
