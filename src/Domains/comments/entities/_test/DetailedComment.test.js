const { DetailedReply } = require('../../../replies/entities')
const { DetailedComment } = require('..')

describe('a DetailedComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'content',
      created_at: new Date()
    }

    // Action and Assert
    expect(() => new DetailedComment(payload)).toThrowError(
      'DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1234,
      content: 'content',
      is_deleted: 'false',
      created_at: new Date(),
      username: 'username'
    }

    // Action and Assert
    expect(() => new DetailedComment(payload)).toThrowError(
      'DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create DetailedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-1234',
      content: 'content',
      is_deleted: false,
      created_at: new Date(),
      username: 'username',
      like_count: 0
    }

    // Action
    const detailedComment = new DetailedComment(payload)

    // Assert
    expect(detailedComment.id).toEqual(payload.id)
    expect(detailedComment.content).toEqual(payload.content)
    expect(detailedComment.date).toEqual(payload.created_at.toJSON())
    expect(detailedComment.username).toEqual(payload.username)
    expect(detailedComment.likeCount).toEqual(payload.like_count)
  })

  it('should create DetailedComment object correctly when comment is deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-1234',
      content: 'content',
      is_deleted: true,
      created_at: '2021-12-31T01:23:45.678Z',
      username: 'username',
      like_count: 1
    }

    // Action
    const deletedComment = new DetailedComment(payload)

    // Assert
    expect(deletedComment.id).toEqual(payload.id)
    expect(deletedComment.content).toEqual('**komentar telah dihapus**')
    expect(deletedComment.date).toEqual(payload.created_at)
    expect(deletedComment.username).toEqual(payload.username)
    expect(deletedComment.likeCount).toEqual(payload.like_count)
  })

  it('should update replies attribute correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-1234',
      content: 'content',
      is_deleted: false,
      created_at: new Date(),
      username: 'username',
      like_count: 4
    }
    const repliesPayload = [
      new DetailedReply({
        id: 'reply-1234',
        content: 'content',
        is_deleted: false,
        created_at: new Date(),
        username: 'username'
      }),
      new DetailedReply({
        id: 'reply-1235',
        content: 'content',
        is_deleted: true,
        created_at: new Date(),
        username: 'username'
      }),
      new DetailedReply({
        id: 'reply-1236',
        content: 'content',
        is_deleted: false,
        created_at: '2021-12-31T01:23:45.678Z',
        username: 'username'
      })
    ]

    // Action
    const detailedComment = new DetailedComment(payload)
    detailedComment.setReplies(repliesPayload)

    // Assert
    expect(detailedComment.replies).toStrictEqual(repliesPayload)
  })
})
