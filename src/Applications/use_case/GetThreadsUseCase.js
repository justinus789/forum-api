class GetThreadsUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(thread_id) {
    const thread = await this._threadRepository.getThreadById(thread_id);
    const comments = await this._commentRepository.getCommentsByThreadId(thread_id);
    thread['comments'] = comments;
    return thread;
  }
}

module.exports = GetThreadsUseCase;
