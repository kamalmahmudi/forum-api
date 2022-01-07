const {
  AddThreadUseCase,
  GetThreadUseCase
} = require('../../../../Applications/use_cases')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.getThreadHandler = this.getThreadHandler.bind(this)
  }

  async postThreadHandler (request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
    const addedThread = await addThreadUseCase.execute(
      request.payload,
      request.auth.credentials
    )
    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201)
    return response
  }

  async getThreadHandler (request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name)
    const thread = await getThreadUseCase.execute({
      id: request.params.threadId
    })
    return {
      status: 'success',
      data: {
        thread
      }
    }
  }
}

module.exports = ThreadsHandler
