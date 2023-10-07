const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment function correctly', async () => {
    // Arrange
    const payload = {
      content: 'Content Test A',
    };
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: payload.content,
      date: new Date().toISOString(),
      owner: 'user-123',
      thread_id: 'thread-123',
    });

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockCommentRepository.addComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedComment({
          id: 'comment-123',
          content: payload.content,
          date: mockAddedComment.date,
          owner: 'user-123',
          thread_id: 'thread-123',
        })
      )
    );
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      })
    );

    // creating use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(
      payload,
      mockAddedComment.owner,
      mockAddedComment.date,
      mockAddedComment.thread_id
    );

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment(mockAddedComment));
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment(payload),
      mockAddedComment.owner,
      mockAddedComment.date,
      mockAddedComment.thread_id
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
  });
});
