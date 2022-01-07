const {
  DomainErrorTranslator,
  AuthorizationError,
  InvariantError,
  NotFoundError
} = require('..')

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(
      DomainErrorTranslator.translate(new Error('COMMENT_REPOSITORY.NOT_FOUND'))
    ).toStrictEqual(new NotFoundError('komentar tidak dapat ditemukan'))
    expect(
      DomainErrorTranslator.translate(
        new Error('COMMENT_REPOSITORY.THREAD_NOT_FOUND')
      )
    ).toStrictEqual(
      new NotFoundError(
        'tidak dapat membuat komentar baru karena thread tidak dapat ditemukan'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('COMMENT_REPOSITORY.USER_NOT_FOUND')
      )
    ).toStrictEqual(
      new NotFoundError(
        'tidak dapat membuat komentar baru karena user tidak dapat ditemukan'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('COMMENT_REPOSITORY.NOT_THE_OWNER')
      )
    ).toStrictEqual(
      new AuthorizationError(
        'komentar hanya dapat dihapus atau diubah oleh pemilik komentar'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('LOGOUT_USER_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
      )
    ).toStrictEqual(new InvariantError('harus mengirimkan token refresh'))
    expect(
      DomainErrorTranslator.translate(
        new Error(
          'LOGOUT_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
      )
    ).toStrictEqual(new InvariantError('refresh token harus string'))
    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak lengkap'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak lengkap'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat balasan baru karena tipe data tidak sesuai'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak lengkap'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
      )
    ).toStrictEqual(new InvariantError('harus mengirimkan token refresh'))
    expect(
      DomainErrorTranslator.translate(
        new Error(
          'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
      )
    ).toStrictEqual(new InvariantError('refresh token harus string'))
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena properti yang dibutuhkan tidak lengkap'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena tipe data tidak sesuai'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena karakter username melebihi batas limit'
      )
    )
    expect(
      DomainErrorTranslator.translate(new Error('REPLY_REPOSITORY.NOT_FOUND'))
    ).toStrictEqual(new NotFoundError('balasan tidak dapat ditemukan'))
    expect(
      DomainErrorTranslator.translate(
        new Error('REPLY_REPOSITORY.COMMENT_NOT_FOUND')
      )
    ).toStrictEqual(
      new NotFoundError(
        'tidak dapat membuat balasan baru karena komentar tidak dapat ditemukan'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('REPLY_REPOSITORY.USER_NOT_FOUND')
      )
    ).toStrictEqual(
      new NotFoundError(
        'tidak dapat membuat balasan baru karena user tidak dapat ditemukan'
      )
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('REPLY_REPOSITORY.NOT_THE_OWNER')
      )
    ).toStrictEqual(
      new AuthorizationError(
        'balasan hanya dapat dihapus atau diubah oleh pemilik balasan'
      )
    )
    expect(
      DomainErrorTranslator.translate(new Error('THREAD_REPOSITORY.NOT_FOUND'))
    ).toStrictEqual(new NotFoundError('thread tidak dapat ditemukan'))
    expect(
      DomainErrorTranslator.translate(
        new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError('harus mengirimkan username dan password')
    )
    expect(
      DomainErrorTranslator.translate(
        new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(new InvariantError('username dan password harus string'))
  })

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message')

    // Action
    const translatedError = DomainErrorTranslator.translate(error)

    // Assert
    expect(translatedError).toStrictEqual(error)
  })
})
