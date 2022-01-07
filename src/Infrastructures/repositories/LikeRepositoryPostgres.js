const { LikeRepository } = require('../../Domains/likes')

class LikeRepositoryPostgres extends LikeRepository {}

module.exports = LikeRepositoryPostgres
