const { NotFoundError } = require('../../Commons/exceptions')
const { AddedThread, DetailedThread } = require('../../Domains/threads/entities')
const { ThreadRepository } = require('../../Domains/threads')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async add (newThread) {
    const { title, body, owner } = newThread
    const id = `thread-${this._idGenerator()}`

    const query = {
      text:
        'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner]
    }

    const result = await this._pool.query(query)

    return new AddedThread({ ...result.rows[0] })
  }

  async find (id) {
    const query = {
      text: 'SELECT t.*, u.username FROM threads t LEFT JOIN users u ON u.id = t.owner WHERE t.id = $1 ORDER BY t.created_at',
      values: [id]
    }

    const { rows, rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('THREAD_REPOSITORY.NOT_FOUND')
    }
    return new DetailedThread(rows[0])
  }
}

module.exports = ThreadRepositoryPostgres
