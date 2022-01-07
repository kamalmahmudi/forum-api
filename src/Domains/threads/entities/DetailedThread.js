class DetailedThread {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, title, body, created_at: date, username } = payload

    this.id = id
    this.title = title
    this.body = body
    this.date = date instanceof Date ? date.toJSON() : date
    this.username = username
  }

  _verifyPayload ({ id, title, body, created_at: date, username }) {
    if (!id || !title || !body || !date || !username) {
      throw new Error('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      !(date instanceof Date || typeof date === 'string') ||
      typeof username !== 'string'
    ) {
      throw new Error('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }

  setComments (comments) {
    this.comments = comments
  }
}

module.exports = DetailedThread
