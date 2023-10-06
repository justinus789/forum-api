const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const serverTestHelper = require('../../../../tests/ServerTestHelper');

describe('/threads function', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted threads', async () => {
      // Arrange
      const requestPayload = {
        title: 'Title Test A',
        body: 'Body Test A',
      };
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 401 when not contain Access Token', async () => {
      // Arrange
      const requestPayload = {
        title: 'Title Test A',
        body: 'Body Test A',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {
        title: 'Title Test A',
      };
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: ['Title Test A'],
        body: true,
      };
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      );
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and get thread data correctly', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);
      const threadId = await serverTestHelper.getThreadId(server, accessToken);
      // comment no.1
      await serverTestHelper.getCommentId(server, accessToken, threadId);
      // comment no.2 that will be deleted
      const deletedCommentId = await serverTestHelper.getCommentId(server, accessToken, threadId);
      // delete comment no.2
      await serverTestHelper.deleteComment(server, accessToken, threadId, deletedCommentId);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      const commentsArray = responseJson.data.thread.comments;
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(commentsArray).toBeDefined();

      // should be sorted ascending
      expect(commentsArray).toStrictEqual(
        [...commentsArray].sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        })
      );

      // not deleted comment
      expect(commentsArray[0].content).not.toStrictEqual('**komentar telah dihapus**');

      // deleted comment
      expect(commentsArray[1].content).toStrictEqual('**komentar telah dihapus**');
    });

    it('should response 404 when threadId not found', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-not-found';

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
