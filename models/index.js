const bookshelf = require('../bookshelf')
const Product=bookshelf.model('Product',{
    tableName:'products',
    category(){
        return this.belongsTo('Category')
    },

    skintype(){
        return this.belongsTo('Skintype')
    },

    brand(){
        return this.belongsTo('Brand')
    },
    tags(){
        return this.belongsToMany('Tag')
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

const Brand=bookshelf.model('Brand',{
    tableName:'brands',
    products(){
        return this.hasMany('Product')
    }
})

const Tag=bookshelf.model('Tag',{
    tableName:'tags',
    products(){
        return this.belongsToMany('Product')
    }
})

const User=bookshelf.model('User',{
    tableName:'users'
})

const Bag=bookshelf.model('Bag',{
    tableName:'shopping_bag',
    products(){
        return this.belongsTo('Product')
    },
    users(){
        return this.belongsTo('User')
    }
})
module.exports={Product,Category,Skintype,Brand,Tag,User,Bag}