const serverTestHelper = {
  async getAccessToken(server, username = 'dicoding') {
    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username,
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });
    // login
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username,
        password: 'secret',
      },
    });
    const loginResponseJson = JSON.parse(loginResponse.payload);

    return loginResponseJson.data.accessToken;
  },

  async getThreadId(server, accessToken) {
    // Add Thread
    const addedThreadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'Title Test A',
        body: 'Body Test A',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const addedThreadResponseJson = JSON.parse(addedThreadResponse.payload);

    return addedThreadResponseJson.data.addedThread.id;
  },

  async getCommentId(server, accessToken, threadId) {
    // Add Comment
    const addedCommentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content: `Test Content ${new Date().toISOString()}`,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const addedCommentResponseJson = JSON.parse(addedCommentResponse.payload);

    return addedCommentResponseJson.data.addedComment.id;
  },

  async deleteComment(server, accessToken, threadId, commentId) {
    // Delete comment
    await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

module.exports = serverTestHelper;
