const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadsUseCase = require('../GetThreadsUseCase');

describe('GetThreadsUseCase', () => {
  it('should orchestrating the get threads action correctly', async () => {
    // Arrange
    const expectedResult = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // Creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      })
    );
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
        },
      ])
    );

    // Creating use case instance
    const getThreadUseCase = new GetThreadsUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await getThreadUseCase.execute('thread-123');

    // Assert
    expect(result).toStrictEqual(expectedResult);

    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
  });
});
