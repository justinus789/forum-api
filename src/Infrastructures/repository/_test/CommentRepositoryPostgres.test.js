const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
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
});
