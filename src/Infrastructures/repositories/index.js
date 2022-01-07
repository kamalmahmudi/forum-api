const AuthenticationRepositoryPostgres = require('./AuthenticationRepositoryPostgres')
const CommentRepositoryPostgres = require('./CommentRepositoryPostgres')
const LikeRepositoryPostgres = require('./LikeRepositoryPostgres')
const ReplyRepositoryPostgres = require('./ReplyRepositoryPostgres')
const ThreadRepositoryPostgres = require('./ThreadRepositoryPostgres')
const UserRepositoryPostgres = require('./UserRepositoryPostgres')

module.exports = {
  AuthenticationRepositoryPostgres,
  CommentRepositoryPostgres,
  LikeRepositoryPostgres,
  ReplyRepositoryPostgres,
  ThreadRepositoryPostgres,
  UserRepositoryPostgres
}
