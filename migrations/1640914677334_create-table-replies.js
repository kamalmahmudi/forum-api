exports.up = pgm => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    is_deleted: {
      type: 'BOOLEAN',
      default: false
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP')
    }
  })
  pgm.createIndex('replies', 'is_deleted')
  pgm.addConstraint(
    'replies',
    'fk_replies.comment_id_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
  )
  pgm.addConstraint(
    'replies',
    'fk_replies.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  )
}

exports.down = pgm => {
  pgm.dropTable('replies')
}
