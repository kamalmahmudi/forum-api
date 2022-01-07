/* istanbul ignore file */
const pool = require('../../src/Infrastructures/database/postgres/pool')

const LikesTableTestHelper = {
  async addLike ({
    id = 'like-1234',
    commentId = 'comment-1234',
    owner = 'user-1234'
  }) {
    const query = {
      text: 'INSERT INTO likes (id, comment_id, owner) VALUES($1, $2, $3)',
      values: [id, commentId, owner]
    }

    await pool.query(query)
  },

  async findLikesById (id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM likes WHERE 1=1')
  }
}

module.exports = LikesTableTestHelper
