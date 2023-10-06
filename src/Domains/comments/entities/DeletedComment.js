class DeletedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, owner, thread_id, deleted_at } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.owner = owner;
    this.thread_id = thread_id;
    this.deleted_at = deleted_at;
  }

  _verifyPayload({ id, content, date, owner, thread_id, deleted_at }) {
    if (!id || !content || !date || !owner || !thread_id || !deleted_at) {
      throw new Error('DELETED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      typeof owner !== 'string' ||
      typeof thread_id !== 'string' ||
      typeof deleted_at !== 'string'
    ) {
      throw new Error('DELETED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeletedComment;
