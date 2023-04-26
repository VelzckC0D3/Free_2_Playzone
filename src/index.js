/* eslint-disable no-useless-concat */
/* eslint-disable no-console */
import './style.css';

import {
  gameCardsElement, options, invAPI, likeGame, getLikes, getComments, addComment,
  fetchData, likes, createGameCardHTML, renderGameCards, init,
} from './module/behaviors.js';

gameCardsElement();
options();
invAPI();
likeGame();
getLikes();
likeGame();
getComments();
addComment();
fetchData();
likes();
createGameCardHTML();
renderGameCards();
init();