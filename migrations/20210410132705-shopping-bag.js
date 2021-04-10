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
  return db.createTable('shopping_bag',{
      id:{type:'int',unsigned:true,primaryKey:true,autoIncrement:true},
      quantity: { type: 'int', unsigned: true },
      user_id:{
          type:'int',
          notNull:true,
          foreignKey:{
              name:'shopping_bag_user_fk',
              table:'users',
              mapping:'id',
              rules:{
                  OnDelete:'CASCADE',
                  OnUpdate:'CASCADE'
              }
          }
      },
      product_id:{
          type:'int',
          notNull:true,
          unsigned:true,
          foreignKey:{
              name:'shopping_bag_product_fk',
              table:'products',
              mapping:'id',
              rules:{
                  OnDelete:'CASCADE',
                  OnUpdate:'CASCADE'
              }

          }
      }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
