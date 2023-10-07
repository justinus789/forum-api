class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(comment_id, owner, date, thread_id) {
    await this._threadRepository.getThreadById(thread_id);
    await this._commentRepository.verifyCommentAvailability(comment_id);
    await this._commentRepository.verifyCommentOwner(comment_id, owner);
    return this._commentRepository.deleteComment(comment_id, date);
  }
}

module.exports = DeleteCommentUseCase;
