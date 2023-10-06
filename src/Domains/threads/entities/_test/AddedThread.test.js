const AddedThread = require('../AddedThread');

describe('A AddedThread entities', () => {
  it('Should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: '',
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: { id: '23' },
      title: 1,
      body: true,
      date: 34,
      owner: ['tes'],
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('Should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Title A',
      body: 'Body of Title A',
      date: new Date().toISOString(),
      owner: 'user-123',
    };

    // Action
    const { id, title, body, date, owner } = new AddedThread(payload);

    // Assert
    expect(id).toStrictEqual(payload.id);
    expect(title).toStrictEqual(payload.title);
    expect(body).toStrictEqual(payload.body);
    expect(date).toStrictEqual(payload.date);
    expect(owner).toStrictEqual(payload.owner);
  });
});
