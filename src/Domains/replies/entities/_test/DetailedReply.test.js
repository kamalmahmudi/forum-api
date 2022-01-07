const { DetailedReply } = require('..')

describe('a DetailedReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'content',
      created_at: new Date()
    }

    // Action and Assert
    expect(() => new DetailedReply(payload)).toThrowError(
      'DETAILED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
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
    expect(() => new DetailedReply(payload)).toThrowError(
      'DETAILED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create DetailedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-1234',
      content: 'content',
      is_deleted: false,
      created_at: new Date(),
      username: 'username'
    }

    // Action
    const detailedReply = new DetailedReply(payload)

    // Assert
    expect(detailedReply.id).toEqual(payload.id)
    expect(detailedReply.content).toEqual(payload.content)
    expect(detailedReply.date).toEqual(payload.created_at.toJSON())
    expect(detailedReply.username).toEqual(payload.username)
  })

  it('should create DetailedReply object correctly when reply is deleted', () => {
    // Arrange
    const payload = {
      id: 'reply-1234',
      content: 'content',
      is_deleted: true,
      created_at: '2021-12-31T01:23:45.678Z',
      username: 'username'
    }

    // Action
    const deletedReply = new DetailedReply(payload)

    // Assert
    expect(deletedReply.id).toEqual(payload.id)
    expect(deletedReply.content).toEqual('**balasan telah dihapus**')
    expect(deletedReply.date).toEqual(payload.created_at)
    expect(deletedReply.username).toEqual(payload.username)
  })
})
