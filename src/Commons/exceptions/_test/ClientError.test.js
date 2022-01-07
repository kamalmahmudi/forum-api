const { ClientError } = require('..')

describe('ClientError', () => {
  it('should throw error when directly use it', () => {
    expect(() => new ClientError('')).toThrowError(
      'cannot instantiate abstract class'
    )
  })
})
