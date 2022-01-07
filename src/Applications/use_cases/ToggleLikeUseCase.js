const { NewLike } = require('../../Domains/likes/entities')

class ToggleLikeUseCase {
  constructor ({ likeRepository, commentRepository }) {
    this._likeRepository = likeRepository
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload, authCredentials) {
    const newLike = new NewLike({
      ...useCasePayload,
      owner: authCredentials.user.id
    })
    await this._commentRepository.findByIdAndThreadId(
      newLike.commentId,
      newLike.threadId
    )
    try {
      await this._likeRepository.deleteByCommentIdAndOwner(
        newLike.commentId,
        newLike.owner
      )
    } catch (error) {
      // like not found
      await this._likeRepository.add(newLike)
    }
    return true
  }
}

module.exports = ToggleLikeUseCase
