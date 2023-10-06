const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const date = new Date().toISOString();
    const { threadId: thread_id } = request.params;

    const addedComment = await addCommentUseCase.execute(request.payload, owner, date, thread_id);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const date = new Date().toISOString();
    const { threadId: thread_id } = request.params;
    const { commentId: comment_id } = request.params;

    await deleteCommentUseCase.execute(comment_id, owner, date, thread_id);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
