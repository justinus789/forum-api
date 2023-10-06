class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, owner, thread_id } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.owner = owner;
    this.thread_id = thread_id;
  }

  _verifyPayload({ id, content, date, owner, thread_id }) {
    if (!id || !content || !date || !owner || !thread_id) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      typeof owner !== 'string' ||
      typeof thread_id !== 'string'
    ) {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
