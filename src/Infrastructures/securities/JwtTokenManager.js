const { AuthenticationTokenManager } = require('../../Applications/securities')
const { InvariantError } = require('../../Commons/exceptions')

class JwtTokenManager extends AuthenticationTokenManager {
  constructor (jwt) {
    super()
    this._jwt = jwt
  }

  async createAccessToken (payload) {
    return this._jwt.generate(payload, process.env.ACCESS_TOKEN_KEY, {
      ttlSec: parseInt(process.env.ACCESS_TOKEN_AGE)
    })
  }

  async createRefreshToken (payload) {
    return this._jwt.generate(payload, process.env.REFRESH_TOKEN_KEY)
  }

  async verifyAccessToken (token) {
    try {
      const artifacts = this._jwt.decode(token)
      this._jwt.verify(artifacts, process.env.ACCESS_TOKEN_KEY)
    } catch (error) {
      throw new InvariantError('access token tidak valid')
    }
  }

  async verifyRefreshToken (token) {
    try {
      const artifacts = this._jwt.decode(token)
      this._jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY)
    } catch (error) {
      throw new InvariantError('refresh token tidak valid')
    }
  }

  async decodePayload (token) {
    const artifacts = this._jwt.decode(token)
    return artifacts.decoded.payload
  }
}

module.exports = JwtTokenManager
