const { getComments } = require('./comments.js');

describe('getComments function', () => {
  it('should throw an error if the request fails', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 404 }));
    await expect(getComments(123)).rejects.toThrowError('response.json is not a function');
  });

  it('should return an array of comments if the request is successful', async () => {
    const comments = [{ id: 1, text: 'Great game!' }, { id: 2, text: 'I love it!' }];
    global.fetch = jest.fn(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve(comments),
    }));
    const result = await getComments(123);
    expect(result).toEqual(comments);
  });
});