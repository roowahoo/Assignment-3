const bookshelf = require('../bookshelf')
const Product=bookshelf.model('Product',{
    tableName:'products',
    category(){
        return this.belongsTo('Category')
    },

    skintype(){
        return this.belongsTo('Skintype')
    }
});

const Category=bookshelf.model('Category',{
    tableName:'categories',
    products(){
        return this.hasMany('Product')
    }
})

const Skintype=bookshelf.model('Skintype',{
    tableName:'skintype',
    products(){
        return this.hasMany('Product')
    }
})
module.exports={Product,Category,Skintype}