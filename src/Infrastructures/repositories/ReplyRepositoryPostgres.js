const {
  AuthorizationError,
  NotFoundError
} = require('../../Commons/exceptions')
const { AddedReply, DetailedReply } = require('../../Domains/replies/entities')
const { ReplyRepository } = require('../../Domains/replies')

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async add (newReply) {
    const { content, commentId, owner } = newReply
    const id = `reply-${this._idGenerator()}`

    const query = {
      text:
        'INSERT INTO replies (id, content, comment_id, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, commentId, owner]
    }

    try {
      const result = await this._pool.query(query)
      return new AddedReply({ ...result.rows[0] })
    } catch (error) {
      if (error.code === '23503') {
        if (error.constraint === 'fk_replies.comment_id_comments.id') {
          throw new NotFoundError('REPLY_REPOSITORY.COMMENT_NOT_FOUND')
        } else { // error.constraint === 'fk_replies.owner_users.id')
          throw new NotFoundError('REPLY_REPOSITORY.USER_NOT_FOUND')
        }
      }
      throw error
    }
  }

  async find (id) {
    const query = {
      text: 'SELECT id, content, comment_id, owner FROM replies WHERE id = $1 AND is_deleted = $2',
      values: [id, false]
    }

    const { rows, rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('REPLY_REPOSITORY.NOT_FOUND')
    }
    return rows[0]
  }

  async findByIdAndCommentId (id, commentId) {
    const query = {
      text: 'SELECT id, content, comment_id, owner FROM replies WHERE id = $1 AND comment_id = $2 AND is_deleted = $3',
      values: [id, commentId, false]
    }

    const { rows, rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('REPLY_REPOSITORY.NOT_FOUND')
    }
    return rows[0]
  }

  async findAllByCommentId (commentId) {
    const query = {
      text: 'SELECT r.*, u.username FROM replies r LEFT JOIN users u ON u.id = r.owner WHERE r.comment_id = $1 ORDER BY r.created_at',
      values: [commentId]
    }

    const { rows, rowCount } = await this._pool.query(query)
    return rowCount ? rows.map(row => new DetailedReply(row)) : undefined
  }

  async findAllByCommentIds (commentIds) {
    const query = {
      text: 'SELECT r.*, u.username FROM replies r LEFT JOIN users u ON u.id = r.owner WHERE r.comment_id = ANY($1::text[]) ORDER BY r.created_at',
      values: [commentIds]
    }

    const { rows } = await this._pool.query(query)
    const retval = {}
    rows.forEach(row => {
      if (retval[row.comment_id] === undefined) retval[row.comment_id] = []
      retval[row.comment_id].push(new DetailedReply(row))
    })
    return retval
  }

  async verifyOwnership (reply, owner) {
    if (reply.owner !== owner) {
      throw new AuthorizationError('REPLY_REPOSITORY.NOT_THE_OWNER')
    }
    return true
  }

  async delete (id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = $1 WHERE id = $2 AND is_deleted = $3',
      values: [true, id, false]
    }

    const { rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('REPLY_REPOSITORY.NOT_FOUND')
    }
    return true
  }
}

module.exports = ReplyRepositoryPostgres
