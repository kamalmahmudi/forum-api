const AuthenticationRepositoryPostgres = require('./AuthenticationRepositoryPostgres')
const CommentRepositoryPostgres = require('./CommentRepositoryPostgres')
const ReplyRepositoryPostgres = require('./ReplyRepositoryPostgres')
const ThreadRepositoryPostgres = require('./ThreadRepositoryPostgres')
const UserRepositoryPostgres = require('./UserRepositoryPostgres')

module.exports = {
  AuthenticationRepositoryPostgres,
  CommentRepositoryPostgres,
  ReplyRepositoryPostgres,
  ThreadRepositoryPostgres,
  UserRepositoryPostgres
}
