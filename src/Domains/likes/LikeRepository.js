class LikeRepository {
  async add (newReply) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteByCommentIdAndOwner (commentId, owner) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = LikeRepository
