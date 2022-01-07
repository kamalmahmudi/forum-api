const { NewReply } = require('../../Domains/replies/entities')

class AddReplyUseCase {
  constructor ({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload, authCredentials) {
    const newReply = new NewReply({
      ...useCasePayload,
      owner: authCredentials.user.id
    })
    await this._commentRepository.findByIdAndThreadId(
      newReply.commentId,
      newReply.threadId
    )
    return this._replyRepository.add(newReply)
  }
}

module.exports = AddReplyUseCase
