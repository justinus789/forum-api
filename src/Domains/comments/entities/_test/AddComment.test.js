const AddComment = require('../AddComment');

describe('A AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: true,
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'Content A',
    };

    // Action
    const { content } = new AddComment(payload);

    // Assert
    expect(content).toStrictEqual(payload.content);
  });
});
