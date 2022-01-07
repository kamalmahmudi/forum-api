/* istanbul ignore file */
const pool = require('../../src/Infrastructures/database/postgres/pool')

const RepliesTableTestHelper = {
  async addReply ({
    id = 'reply-1234',
    content = 'content',
    isDeleted = false,
    commentId = 'comment-1234',
    owner = 'user-1234'
  }) {
    const query = {
      text: 'INSERT INTO replies (id, content, is_deleted, comment_id, owner) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, isDeleted, commentId, owner]
    }

    await pool.query(query)
  },

  async findRepliesById (id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM replies WHERE 1=1')
  }
}

module.exports = RepliesTableTestHelper
