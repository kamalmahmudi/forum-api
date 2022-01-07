const { NewLike } = require('..')

describe('a NewLike entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-1234',
      commentId: 'comment-1234'
    }

    // Action & Assert
    expect(() => new NewLike(payload)).toThrowError(
      'NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-1234',
      commentId: 'comment-1234',
      owner: 1234
    }

    // Action & Assert
    expect(() => new NewLike(payload)).toThrowError(
      'NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create NewLike entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-1234',
      commentId: 'comment-1234',
      owner: 'user-1234'
    }

    // Action
    const newLike = new NewLike(payload)

    // Assert
    expect(newLike).toBeInstanceOf(NewLike)
    expect(newLike.threadId).toEqual(payload.threadId)
    expect(newLike.commentId).toEqual(payload.commentId)
    expect(newLike.owner).toEqual(payload.owner)
  })
})
