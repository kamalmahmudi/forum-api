const { InvariantError } = require('../../Commons/exceptions')
const { AuthenticationRepository } = require('../../Domains/authentications')

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor (pool) {
    super()
    this._pool = pool
  }

  async add (token) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token]
    }

    await this._pool.query(query)
  }

  async checkAvailability (token) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token]
    }

    const result = await this._pool.query(query)

    if (result.rows.length === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database')
    }
  }

  async delete (token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token]
    }

    await this._pool.query(query)
  }
}

module.exports = AuthenticationRepositoryPostgres
