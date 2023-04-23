const invAPI = 'http://localhost:3000';

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

module.exports = {
  likeGame,
};