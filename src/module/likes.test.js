const { likeGame } = require('./likes.js');

global.fetch = jest.fn(() => Promise.resolve({}));

describe('likeGame function', () => {
  it('should call the API with the correct URL and request parameters', async () => {
    const id = '123';
    const API_URL = 'http://localhost:3000/likes';
    const expectedRequestBody = {
      item_id: id,
    };
    const expectedRequestHeaders = {
      'Content-type': 'application/json; charset=UTF-8',
    };

    await likeGame(id);

    expect(fetch).toHaveBeenCalledWith(API_URL, {
      method: 'POST',
      body: JSON.stringify(expectedRequestBody),
      headers: expectedRequestHeaders,
    });
  });
});