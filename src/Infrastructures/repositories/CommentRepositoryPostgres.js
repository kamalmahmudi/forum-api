const {
  AuthorizationError,
  NotFoundError
} = require('../../Commons/exceptions')
const { AddedComment, DetailedComment } = require('../../Domains/comments/entities')
const { CommentRepository } = require('../../Domains/comments')

class CommentRepositoryPostgres extends CommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async add (newComment) {
    const { content, threadId, owner } = newComment
    const id = `comment-${this._idGenerator()}`

    const query = {
      text:
        'INSERT INTO comments (id, content, thread_id, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, threadId, owner]
    }

    try {
      const result = await this._pool.query(query)
      return new AddedComment({ ...result.rows[0] })
    } catch (error) {
      if (error.code === '23503') {
        if (error.constraint === 'fk_comments.thread_id_threads.id') {
          throw new NotFoundError('COMMENT_REPOSITORY.THREAD_NOT_FOUND')
        } else { // error.constraint === 'fk_comments.owner_users.id')
          throw new NotFoundError('COMMENT_REPOSITORY.USER_NOT_FOUND')
        }
      }
      throw error
    }
  }

  async find (id) {
    const query = {
      text: 'SELECT id, content, thread_id, owner FROM comments WHERE id = $1 AND is_deleted = $2',
      values: [id, false]
    }

    const { rows, rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('COMMENT_REPOSITORY.NOT_FOUND')
    }
    return rows[0]
  }

  async findByIdAndThreadId (id, threadId) {
    const query = {
      text: 'SELECT id, content, thread_id, owner FROM comments WHERE id = $1 AND thread_id = $2 AND is_deleted = $3',
      values: [id, threadId, false]
    }

    const { rows, rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('COMMENT_REPOSITORY.NOT_FOUND')
    }
    return rows[0]
  }

  async findAllByThreadId (threadId) {
    const query = {
      text: 'SELECT c.*, u.username FROM comments c LEFT JOIN users u ON u.id = c.owner WHERE c.thread_id = $1 ORDER BY c.created_at',
      values: [threadId]
    }

    const { rows, rowCount } = await this._pool.query(query)
    return rowCount ? rows.map(row => new DetailedComment(row)) : undefined
  }

  async verifyOwnership (comment, owner) {
    if (comment.owner !== owner) {
      throw new AuthorizationError('COMMENT_REPOSITORY.NOT_THE_OWNER')
    }
    return true
  }

  async delete (id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = $1 WHERE id = $2 AND is_deleted = $3',
      values: [true, id, false]
    }

    const { rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('COMMENT_REPOSITORY.NOT_FOUND')
    }
    return true
  }
}

module.exports = CommentRepositoryPostgres
