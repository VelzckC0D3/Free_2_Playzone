const invAPI = 'http://localhost:3000';

const getComments = async (id) => {
  const API_URL = `${invAPI}/comments?item_id=${id}`;
  const response = await fetch(API_URL);
  return response.json();
};

module.exports = {
  getComments,
};