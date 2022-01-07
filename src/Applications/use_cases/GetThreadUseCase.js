class GetThreadUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute (useCasePayload) {
    const thread = await this._threadRepository.find(useCasePayload.id)
    const comments = await this._commentRepository.findAllByThreadId(thread.id)
    if (comments) {
      const replies = await this._replyRepository.findAllByCommentIds(
        comments.map(comment => comment.id)
      )
      for (const comment of comments) {
        comment.setReplies(replies[comment.id])
      }
      thread.setComments(comments)
    }
    return thread
  }
}

module.exports = GetThreadUseCase
