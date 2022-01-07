/* istanbul ignore file */

const TokenTestHelper = {
  async getValidToken (server) {
    const registerResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'username',
        password: 'password',
        fullname: 'Full Name'
      }
    })
    const {
      data: {
        addedUser: { id }
      }
    } = JSON.parse(registerResponse.payload)
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'username',
        password: 'password'
      }
    })
    const {
      data: { accessToken }
    } = JSON.parse(loginResponse.payload)
    return { token: accessToken, owner: id }
  }
}

module.exports = TokenTestHelper
