const { AddedThread } = require('..')

describe('an AddedThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'title',
      owner: 'owner'
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1234,
      title: 'title',
      owner: 'owner'
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: 'title',
      owner: 'user-1234'
    }

    // Action
    const addedThread = new AddedThread(payload)

    // Assert
    expect(addedThread.id).toEqual(payload.id)
    expect(addedThread.title).toEqual(payload.title)
    expect(addedThread.owner).toEqual(payload.owner)
  })
})
