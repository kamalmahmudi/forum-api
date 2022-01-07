/* istanbul ignore file */
const pool = require('../../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
  async addComment ({
    id = 'comment-1234',
    content = 'content',
    isDeleted = false,
    threadId = 'thread-1234',
    owner = 'user-1234'
  }) {
    const query = {
      text: 'INSERT INTO comments (id, content, is_deleted, thread_id, owner) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, isDeleted, threadId, owner]
    }

    await pool.query(query)
  },

  async findCommentsById (id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
  }
}

module.exports = CommentsTableTestHelper
