/* istanbul ignore file */

const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const {
  AuthenticationTokenManager,
  PasswordHash
} = require('../Applications/securities')
const { AuthenticationRepository } = require('../Domains/authentications')
const { CommentRepository } = require('../Domains/comments')
const { LikeRepository } = require('../Domains/likes')
const { ReplyRepository } = require('../Domains/replies')
const { ThreadRepository } = require('../Domains/threads')
const { UserRepository } = require('../Domains/users')
const {
  AuthenticationRepositoryPostgres,
  CommentRepositoryPostgres,
  LikeRepositoryPostgres,
  ReplyRepositoryPostgres,
  ThreadRepositoryPostgres,
  UserRepositoryPostgres
} = require('./repositories')
const { BcryptPasswordHash, JwtTokenManager } = require('./securities')

// use case
const {
  AddCommentUseCase,
  AddReplyUseCase,
  AddThreadUseCase,
  AddUserUseCase,
  DeleteCommentUseCase,
  DeleteReplyUseCase,
  GetThreadUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  RefreshAuthenticationUseCase,
  ToggleLikeUseCase
} = require('../Applications/use_cases')

// creating container
const container = createContainer()

// registering repositories
container.register([
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        }
      ]
    }
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: LikeRepository.name,
    Class: LikeRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  }
])

// registering services
container.register([
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token
        }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  }
])

// registering use cases
container.register([
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        }
      ]
    }
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'replyRepository',
          internal: ReplyRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        }
      ]
    }
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        }
      ]
    }
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'replyRepository',
          internal: ReplyRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        }
      ]
    }
  },
  {
    key: GetThreadUseCase.name,
    Class: GetThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name
        }
      ]
    }
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        }
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        }
      ]
    }
  },
  {
    key: ToggleLikeUseCase.name,
    Class: ToggleLikeUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'likeRepository',
          internal: LikeRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        }
      ]
    }
  }
])

module.exports = container
