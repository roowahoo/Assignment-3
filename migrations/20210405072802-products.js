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
  return db.createTable('products',{
      id:{type:'int',primaryKey:true,unsigned:true,autoIncrement:true},
      name:{type:'string',length:100},
      description:{type:'string',length:500},
      directions:{type:'string',length:500},
      ingredients:{type:'string',length:500},
      net_weight:{type:'int',unsigned:true},
      price:{type:'int',unsigned:true},
      stock:{type:'int',unsigned:true},
      date_of_manufacture:{type:'date'}

  })
};

exports.down = function(db) {
  return db.dropTable('products')
};

exports._meta = {
  "version": 1
};
