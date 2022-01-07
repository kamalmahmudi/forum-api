const {
  AddReplyUseCase,
  DeleteReplyUseCase
} = require('../../../../Applications/use_cases')

class RepliesHandler {
  constructor (container) {
    this._container = container

    this.postReplyHandler = this.postReplyHandler.bind(this)
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this)
  }

  async postReplyHandler (request, h) {
    const addReplyUseCase = this._container.getInstance(
      AddReplyUseCase.name
    )
    const addedReply = await addReplyUseCase.execute(
      { ...request.payload, ...request.params },
      request.auth.credentials
    )
    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    })
    response.code(201)
    return response
  }

  async deleteReplyHandler (request, h) {
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    )
    await deleteReplyUseCase.execute(request.params, request.auth.credentials)
    return {
      status: 'success'
    }
  }
}

module.exports = RepliesHandler
