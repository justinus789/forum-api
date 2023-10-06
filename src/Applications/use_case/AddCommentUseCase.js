const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload, owner, date, thread_id) {
    const newComment = new AddComment(payload);
    await this._threadRepository.getThreadById(thread_id);
    return this._commentRepository.addComment(newComment, owner, date, thread_id);
  }
}

module.exports = AddCommentUseCase;
