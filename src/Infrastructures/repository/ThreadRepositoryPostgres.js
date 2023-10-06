const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGnerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGnerator;
  }

  async addThread(addThread, date, owner) {
    const { title, body } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(thread_id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
      FROM threads 
      LEFT JOIN users ON users.id = threads.owner
      WHERE threads.id = $1`,
      values: [thread_id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
