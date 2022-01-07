class DetailedComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const {
      id,
      content,
      is_deleted: isDeleted,
      created_at: date,
      username,
      like_count: likeCount = 0
    } = payload

    this.id = id
    this.content = isDeleted ? '**komentar telah dihapus**' : content
    this.date = date instanceof Date ? date.toJSON() : date
    this.username = username
    this.likeCount = parseInt(likeCount)
  }

  _verifyPayload ({
    id,
    content,
    is_deleted: isDeleted,
    created_at: date,
    username,
    like_count: likeCount
  }) {
    if (!id || !content || !date || !username) {
      throw new Error('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      !(typeof isDeleted === 'boolean' || isDeleted === undefined) ||
      !(date instanceof Date || typeof date === 'string') ||
      typeof username !== 'string'
    ) {
      throw new Error('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }

  setReplies (replies) {
    this.replies = replies
  }
}

module.exports = DetailedComment
