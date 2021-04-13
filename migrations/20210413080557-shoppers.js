'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('shoppers',{
      id: { type: 'int', primaryKey:true, autoIncrement:true},
      username: { type: 'string', length:100},
      email: {type: 'string', length:350},
      password: {type: 'string', length:80},
      address:{type:'string',length:500, notNull:false}
  })
};

exports.down = function(db) {
  return db.dropTable('shoppers')
};

exports._meta = {
  "version": 1
};
