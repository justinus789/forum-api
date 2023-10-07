const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => await pool.end());

  describe('addComment function', () => {
    it('should persist add comment and return comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const addComment = new AddComment({
        content: 'Content A',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const date = '2021-08-08T07:19:09.775Z';
      const owner = 'user-123';
      const thread_id = 'thread-123';

      // Action
      await commentRepositoryPostgres.addComment(addComment, owner, date, thread_id);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const addComment = new AddComment({
        content: 'Content A',
      });
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const date = new Date().toISOString();
      const owner = 'user-123';
      const thread_id = 'thread-123';

      // Action
      const result = await commentRepositoryPostgres.addComment(addComment, owner, date, thread_id);

      // Assert
      expect(result).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: addComment.content,
          date,
          owner,
          thread_id,
        })
      );
    });
  });

  describe('verifyCommentOwner Function', () => {
    it('should throw NotFoundError when user is not comment owner', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'test321' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'test654' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-456' });

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should return comment id correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'test321' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      // Action
      const commentId = await commentRepositoryPostgres.verifyCommentOwner(
        'comment-123',
        'user-123'
      );

      // Assert
      expect(commentId).toEqual('comment-123');
    });
  });

  describe('getComentById Function', () => {
    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'test321' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAvailability('comment-not-fond')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return comment id correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'test321' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      // Action
      const commentId = await commentRepositoryPostgres.verifyCommentAvailability('comment-123');

      // Assert
      expect(commentId).toEqual('comment-123');
    });
  });

  describe('deleteComment Function', () => {
    it('should soft delete comment by id correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'test321' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const deletedAt = new Date().toISOString();

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123', deletedAt);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      // make sure the comment is deleted
      expect(comments[0].deleted_at).toStrictEqual(deletedAt);
    });
  });

  describe('getComentByThreadId Function', () => {
    it('should return empty array when comment is not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'test321' });
      await ThreadsTableTestHelper.addThread({ id: 'threadWithoutComment-123' });

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentsByThreadId('threadWithoutComment-123')
      ).resolves.toStrictEqual([]);
    });

    it('should return comments object correctly', async () => {
      // Arrange
      const payload = {
        id: 'comment-123',
        content: 'content A',
        owner: 'user-123',
        threadId: 'threadWithComment-123',
        date: new Date().toISOString(),
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'test321' });
      await ThreadsTableTestHelper.addThread({ id: payload.threadId });
      await CommentsTableTestHelper.addComment(payload);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(payload.threadId);

      // Assert
      expect(comments).toStrictEqual([
        {
          id: payload.id,
          content: payload.content,
          username: 'test321',
          date: payload.date,
          deleted_at: null,
        },
      ]);
    });
  });
});
