const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGnerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGnerator;
  }

  async addComment(addComment, owner, date, thread_id) {
    const { content } = addComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5) RETURNING id, content, date, owner, thread_id',
      values: [id, content, date, owner, thread_id],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentOwner(comment_id, owner) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [comment_id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('bukan pemilik komentar');
    }

    const { id } = result.rows[0];

    return id;
  }

  async getCommentById(comment_id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [comment_id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }

  async deleteComment(id, date) {
    const query = {
      text: 'UPDATE comments SET deleted_at = $1 WHERE id = $2',
      values: [date, id],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(thread_id) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.deleted_at
      FROM comments
      LEFT JOIN users ON users.id = comments.owner
      WHERE thread_id = $1
      ORDER BY comments.date ASC`,
      values: [thread_id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }

    const modifiedResult = result.rows.map((item) => {
      if (item.deleted_at) item.content = '**komentar telah dihapus**';
      delete item.deleted_at;
      return item;
    });

    return modifiedResult;
  }
}

module.exports = CommentRepositoryPostgres;
