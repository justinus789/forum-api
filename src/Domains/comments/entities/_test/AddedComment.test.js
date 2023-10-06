const AddedComment = require('../AddedComment');

describe('A AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'test',
    };

    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: true,
      content: ['test'],
      date: 10,
      owner: { owner: 'user-1231' },
      thread_id: true,
    };

    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
});
