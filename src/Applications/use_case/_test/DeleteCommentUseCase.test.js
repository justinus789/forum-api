const DeletedComment = require('../../../Domains/comments/entities/DeletedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment function correctly', async () => {
    // Arrange
    const mockDeletedComment = new DeletedComment({
      id: 'comment-123',
      content: 'testing 123',
      date: new Date().toISOString(),
      owner: 'user-123',
      thread_id: 'thread-123',
      deleted_at: new Date().toISOString(),
    });

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new DeletedComment({
          id: 'comment-123',
          content: 'testing 123',
          date: mockDeletedComment.date,
          owner: 'user-123',
          thread_id: 'thread-123',
          deleted_at: mockDeletedComment.deleted_at,
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
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve('comment-123'));
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve('comment-123', 'user-123'));

    // creating use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const deletedComment = await deleteCommentUseCase.execute(
      'comment-123',
      mockDeletedComment.owner,
      mockDeletedComment.deleted_at,
      'thread-123'
    );

    // Assert
    expect(deletedComment).toStrictEqual(new DeletedComment(mockDeletedComment));
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      'comment-123',
      mockDeletedComment.deleted_at
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith('comment-123');
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith('comment-123', 'user-123');
  });
});
