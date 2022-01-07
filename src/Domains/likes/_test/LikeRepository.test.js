const { LikeRepository } = require('..')

describe('a LikeRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const likeRepository = new LikeRepository()

    // Action & Assert
    await expect(likeRepository.add({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(likeRepository.deleteByCommentIdAndOwner('')).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
  })
})
