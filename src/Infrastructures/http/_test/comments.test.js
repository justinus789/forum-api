const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const serverTestHelper = require('../../../../tests/ServerTestHelper');

describe('/threads/{threadId}/comments function', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}', () => {
    it('should response 201 and persisted comments', async () => {
      // Arrange
      const requestPayload = {
        content: 'Content A',
      };
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);
      const threadId = await serverTestHelper.getThreadId(server, accessToken);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 401 when not contain Access Token', async () => {
      // Arrange
      const requestPayload = {
        content: 'Content A',
      };
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);
      const threadId = await serverTestHelper.getThreadId(server, accessToken);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when threadId not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'Content A',
      };
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);
      const threadId = 'thread';

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);
      const threadId = await serverTestHelper.getThreadId(server, accessToken);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: true,
      };
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);
      const threadId = await serverTestHelper.getThreadId(server, accessToken);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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
        'tidak dapat membuat comment baru karena tipe data tidak sesuai'
      );
    });
  });

  describe('when DELETE /threads/{threadId}/comments', () => {
    it('should response 200 and soft delete comments', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);
      const threadId = await serverTestHelper.getThreadId(server, accessToken);
      const commentId = await serverTestHelper.getCommentId(server, accessToken, threadId);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when not contain Access Token', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);
      const threadId = await serverTestHelper.getThreadId(server, accessToken);
      const commentId = await serverTestHelper.getCommentId(server, accessToken, threadId);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 403 when user do not have access', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);
      const threadId = await serverTestHelper.getThreadId(server, accessToken);
      const commentId = await serverTestHelper.getCommentId(server, accessToken, threadId);
      const otherAccesToken = await serverTestHelper.getAccessToken(server, 'dicoding2');

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${otherAccesToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when threadId not found', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);
      const threadId = 'thread-not-found';
      const commentId = 'comment-not-found';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when commentId not found', async () => {
      // Arrange
      const server = await createServer(container);
      const accessToken = await serverTestHelper.getAccessToken(server);
      const threadId = await serverTestHelper.getThreadId(server, accessToken);
      const commentId = 'comment-not-found';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
