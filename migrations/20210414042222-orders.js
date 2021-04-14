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
  return db.createTable('orders',{
      id:{type:'int',unsigned:true,primaryKey:true,autoIncrement:true},
      shopper_id:{
          type:'int',
          notNull:true,
          foreignKey:{
              name:'orders_shoppers_fk',
              table:'shoppers',
              mapping:'id',
              rules:{
                  OnDelete:'CASCADE',
                  OnUpdate:'CASCADE'
              }
          }
      },
      shipping_address:{type:'string',length:500},
      contact_number:{type:'string',length:100},
      date:{type:'datetime'},
      amount:{type:'int',unsigned:true},
      status:{type:'string',length:100}
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
