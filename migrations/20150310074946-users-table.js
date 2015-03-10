var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    email: 'string',
    api_key: 'string',
    created_at: 'datetime',
    last_login_at: 'datetime',
    blocked: 'int',
    password: 'string'

  }, callback);
};

exports.down = function(db, callback) {
  callback();
};
