const AddThread = require('../AddThread');

describe('A AddThread entities', () => {
  it('Should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: '',
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 1,
      body: true,
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('Should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Title A',
      body: 'Body of Title A',
    };

    // Action
    const { title, body } = new AddThread(payload);

    // Assert
    expect(title).toStrictEqual(payload.title);
    expect(body).toStrictEqual(payload.body);
  });
});
