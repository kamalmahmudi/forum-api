class DeleteReplyUseCase {
  constructor ({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload, authCredentials) {
    const { replyId, threadId, commentId } = useCasePayload
    await this._commentRepository.findByIdAndThreadId(commentId, threadId)
    const reply = await this._replyRepository.findByIdAndCommentId(
      replyId,
      commentId
    )
    await this._replyRepository.verifyOwnership(reply, authCredentials.user.id)
    await this._replyRepository.delete(replyId)
  }
}

module.exports = DeleteReplyUseCase
