const { NotFoundError } = require('../../Commons/exceptions')
const { LikeRepository } = require('../../Domains/likes')

class LikeRepositoryPostgres extends LikeRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async add (newReply) {
    const { commentId, owner } = newReply
    const id = `like-${this._idGenerator()}`

    const query = {
      text:
        'INSERT INTO likes (id, comment_id, owner) VALUES($1, $2, $3)',
      values: [id, commentId, owner]
    }

    try {
      await this._pool.query(query)
      return true
    } catch (error) {
      if (error.code === '23503') {
        if (error.constraint === 'fk_likes.comment_id_comments.id') {
          throw new NotFoundError('LIKE_REPOSITORY.COMMENT_NOT_FOUND')
        } else {
          // error.constraint === 'fk_likes.owner_users.id')
          throw new NotFoundError('LIKE_REPOSITORY.USER_NOT_FOUND')
        }
      }
      throw error
    }
  }

  async deleteByCommentIdAndOwner (commentId, owner) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner]
    }

    const { rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('LIKE_REPOSITORY.NOT_FOUND')
    }
    return true
  }
}

module.exports = LikeRepositoryPostgres
