const { ReplyRepository } = require('..')

describe('a ReplyRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const replyRepository = new ReplyRepository()

    // Action & Assert
    await expect(replyRepository.add({})).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.find('')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.findByIdAndCommentId('', '')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.findAllByCommentId('', '')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.findAllByCommentIds('', '')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.verifyOwnership({}, '')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.delete('')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
  })
})
