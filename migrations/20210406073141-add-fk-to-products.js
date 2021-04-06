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
  return db.addColumn('products', 'skintype_id', {
      type: 'int',
      unsigned:true,
      notNull : true,
      foreignKey: {
          name: 'product_skintype_fk',
          table: 'skintype',
          rules: {
              onDelete:'cascade',
              onUpdate:'restrict'
          },
          mapping: 'id'
      }
  })
};

exports.down = async function(db) {
  await db.removeForeignKey('product_skintype_fk');
  await db.dropColumn('skintype_id');
};

exports._meta = {
  "version": 1
};
