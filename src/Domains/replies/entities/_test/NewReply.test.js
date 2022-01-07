const { NewReply } = require('..')

describe('a NewReply entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'content',
      threadId: 'thread-1234'
    }

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'content',
      threadId: 'thread-1234',
      commentId: 'comment-1234',
      owner: 1234
    }

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create NewReply entities correctly', () => {
    // Arrange
    const payload = {
      content: 'content',
      threadId: 'thread-1234',
      commentId: 'comment-1234',
      owner: 'user-1234'
    }

    // Action
    const newReply = new NewReply(payload)

    // Assert
    expect(newReply).toBeInstanceOf(NewReply)
    expect(newReply.content).toEqual(payload.content)
    expect(newReply.threadId).toEqual(payload.threadId)
    expect(newReply.commentId).toEqual(payload.commentId)
    expect(newReply.owner).toEqual(payload.owner)
  })
})
