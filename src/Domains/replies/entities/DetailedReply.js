class DetailedReply {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, content, is_deleted: isDeleted, created_at: date, username } = payload

    this.id = id
    this.content = isDeleted ? '**balasan telah dihapus**' : content
    this.date = date instanceof Date ? date.toJSON() : date
    this.username = username
  }

  _verifyPayload ({ id, content, is_deleted: isDeleted, created_at: date, username }) {
    if (!id || !content || !date || !username) {
      throw new Error('DETAILED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      !(typeof isDeleted === 'boolean' || isDeleted === undefined) ||
      !(date instanceof Date || typeof date === 'string') ||
      typeof username !== 'string'
    ) {
      throw new Error('DETAILED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DetailedReply
