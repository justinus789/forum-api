const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => await pool.end());

  describe('addThread function', () => {
    it('should persist add thread and return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'Title A',
        body: 'Body A',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const date = new Date().toISOString();
      const owner = 'user-123';

      // Action
      await threadRepositoryPostgres.addThread(addThread, date, owner);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'Title A',
        body: 'Body A',
      });
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const date = new Date().toISOString();
      const owner = 'user-123';

      // Action
      const result = await threadRepositoryPostgres.addThread(addThread, date, owner);

      // Assert
      expect(result).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: addThread.title,
          body: addThread.body,
          date,
          owner,
        })
      );
    });

    describe('getThreadById', () => {
      it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(threadRepositoryPostgres.getThreadById('dicoding')).rejects.toThrowError(
          NotFoundError
        );
      });

      it('should return thread object correctly', async () => {
        // Arrange
        const payoad = {
          id: 'thread-321',
          title: 'title A',
          body: 'body A',
          date: new Date().toISOString(),
        };

        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'test321' });
        await ThreadsTableTestHelper.addThread(payoad);
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action
        const threadId = await threadRepositoryPostgres.getThreadById('thread-321');

        // Assert
        expect(threadId).toEqual({ ...payoad, username: 'test321' });
      });
    });
  });
});
