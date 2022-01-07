const { DetailedComment } = require('../../../comments/entities')
const { DetailedThread } = require('..')

describe('a DetailedThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'title',
      body: 'body'
    }

    // Action and Assert
    expect(() => new DetailedThread(payload)).toThrowError(
      'DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1234,
      title: 'title',
      body: 'body',
      created_at: '2021-12-31T01:23:45.678Z',
      username: 'username'
    }

    // Action and Assert
    expect(() => new DetailedThread(payload)).toThrowError(
      'DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create DetailedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: 'title',
      body: 'body',
      created_at: '2021-12-31T01:23:45.678Z',
      username: 'username'
    }

    // Action
    const detailedThread = new DetailedThread(payload)

    // Assert
    expect(detailedThread.id).toEqual(payload.id)
    expect(detailedThread.title).toEqual(payload.title)
    expect(detailedThread.body).toEqual(payload.body)
    expect(detailedThread.date).toEqual(payload.created_at)
    expect(detailedThread.username).toEqual(payload.username)
    expect(detailedThread.comments).toBeUndefined()
  })

  it('should update comments attribute correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: 'title',
      body: 'body',
      created_at: '2021-12-31T01:23:45.678Z',
      username: 'username'
    }
    const commentsPayload = [
      new DetailedComment({
        id: 'comment-1234',
        content: 'content',
        is_deleted: false,
        created_at: new Date(),
        username: 'username'
      }),
      new DetailedComment({
        id: 'comment-1235',
        content: 'content',
        is_deleted: true,
        created_at: new Date(),
        username: 'username'
      }),
      new DetailedComment({
        id: 'comment-1236',
        content: 'content',
        is_deleted: false,
        created_at: '2021-12-31T01:23:45.678Z',
        username: 'username'
      })
    ]

    // Action
    const detailedThread = new DetailedThread(payload)
    detailedThread.setComments(commentsPayload)

    // Assert
    expect(detailedThread.comments).toStrictEqual(commentsPayload)
  })
})
