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

const Vendor=bookshelf.model('Vendor',{
    tableName:'vendors'
})

const Shopper=bookshelf.model('Shopper',{
    tableName:'shoppers'
})

const Bag=bookshelf.model('Bag',{
    tableName:'shopping_bag',
    products(){
        return this.belongsTo('Product')
    },
    shoppers(){
        return this.belongsTo('Shopper')
    }
})

const Orders=bookshelf.model('Order',{
    tableName:'orders',
    vendors(){
        return this.belongsTo('Vendor')
    }

})

const OrderItems=bookshelf.model('Order_item',{
    tableName:'order_items',
    products(){
        return this.belongsTo('Product')
    }
})
module.exports={Product,Category,Skintype,Brand,Tag,Vendor,Shopper,Bag,Orders,OrderItems}