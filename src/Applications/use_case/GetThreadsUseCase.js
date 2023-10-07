class GetThreadsUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(thread_id) {
    const thread = await this._threadRepository.getThreadById(thread_id);
    const comments = await this._commentRepository.getCommentsByThreadId(thread_id);

    // show deleted comment on content when comment is deleted
    const modifiedCommentsResult = comments.map((item) => {
      if (item.deleted_at) item.content = '**komentar telah dihapus**';
      delete item.deleted_at;
      return item;
    });

    thread['comments'] = modifiedCommentsResult;
    return thread;
  }
}

module.exports = GetThreadsUseCase;
