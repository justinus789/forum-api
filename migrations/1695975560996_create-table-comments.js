/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    parent_id: {
      type: 'VARCHAR(50)',
    },
    deleted_at: {
      type: 'TEXT',
    },
  });

  pgm.addConstraint(
    'comments',
    'fk_comments.thread_id_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'comments',
    'fk_comments.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'comments',
    'fk_comments.parent_id_comments.id',
    'FOREIGN KEY(parent_id) REFERENCES comments(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
