class DeleteCommentUseCase {
  constructor ({ commentRepository }) {
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload, authCredentials) {
    const { commentId, threadId } = useCasePayload
    const comment = await this._commentRepository.findByIdAndThreadId(
      commentId,
      threadId
    )
    await this._commentRepository.verifyOwnership(
      comment,
      authCredentials.user.id
    )
    await this._commentRepository.delete(commentId)
  }
}

module.exports = DeleteCommentUseCase
