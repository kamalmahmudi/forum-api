class NewLike {
  constructor (payload) {
    this._verifyPayload(payload)

    this.threadId = payload.threadId
    this.commentId = payload.commentId
    this.owner = payload.owner
  }

  _verifyPayload (payload) {
    const { threadId, commentId, owner } = payload

    if (!threadId || !commentId || !owner) {
      throw new Error('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = NewLike
