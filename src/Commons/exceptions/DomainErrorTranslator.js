const AuthorizationError = require('./AuthorizationError')
const InvariantError = require('./InvariantError')
const NotFoundError = require('./NotFoundError')

const DomainErrorTranslator = {
  translate (error) {
    return DomainErrorTranslator._directories[error.message] || error
  }
}

DomainErrorTranslator._directories = {
  'COMMENT_REPOSITORY.NOT_FOUND': new NotFoundError(
    'komentar tidak dapat ditemukan'
  ),
  'COMMENT_REPOSITORY.THREAD_NOT_FOUND': new NotFoundError(
    'tidak dapat membuat komentar baru karena thread tidak dapat ditemukan'
  ),
  'COMMENT_REPOSITORY.USER_NOT_FOUND': new NotFoundError(
    'tidak dapat membuat komentar baru karena user tidak dapat ditemukan'
  ),
  'COMMENT_REPOSITORY.NOT_THE_OWNER': new AuthorizationError(
    'komentar hanya dapat dihapus atau diubah oleh pemilik komentar'
  ),
  'LOGOUT_USER_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError(
    'harus mengirimkan token refresh'
  ),
  'LOGOUT_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'refresh token harus string'
  ),
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak lengkap'
  ),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
  ),
  'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak lengkap'
  ),
  'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat balasan baru karena tipe data tidak sesuai'
  ),
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak lengkap'
  ),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat thread baru karena tipe data tidak sesuai'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError(
    'harus mengirimkan token refresh'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'refresh token harus string'
  ),
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak lengkap'
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai'
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang'
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit'
  ),
  'REPLY_REPOSITORY.NOT_FOUND': new NotFoundError(
    'balasan tidak dapat ditemukan'
  ),
  'REPLY_REPOSITORY.COMMENT_NOT_FOUND': new NotFoundError(
    'tidak dapat membuat balasan baru karena komentar tidak dapat ditemukan'
  ),
  'REPLY_REPOSITORY.USER_NOT_FOUND': new NotFoundError(
    'tidak dapat membuat balasan baru karena user tidak dapat ditemukan'
  ),
  'REPLY_REPOSITORY.NOT_THE_OWNER': new AuthorizationError(
    'balasan hanya dapat dihapus atau diubah oleh pemilik balasan'
  ),
  'THREAD_REPOSITORY.NOT_FOUND': new NotFoundError(
    'thread tidak dapat ditemukan'
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan username dan password'
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username dan password harus string'
  )
}

module.exports = DomainErrorTranslator
