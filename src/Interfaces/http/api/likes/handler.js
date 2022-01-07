const { ToggleLikeUseCase } = require('../../../../Applications/use_cases')

class LikesHandler {
  constructor (container) {
    this._container = container

    this.putLikeHandler = this.putLikeHandler.bind(this)
  }

  async putLikeHandler (request, h) {
    const toggleLikeUseCase = this._container.getInstance(
      ToggleLikeUseCase.name
    )
    await toggleLikeUseCase.execute(request.params, request.auth.credentials)
    return {
      status: 'success'
    }
  }
}

module.exports = LikesHandler
