const { Product } = require('../models')
const productDataLayer = require('../dal/product')

class productServices {
    // constructor(product_id) {
    //     this.product_id = product_id;
    // }

    async getAllProducts(){
        const products=await productDataLayer.getAllProducts()
        return products
    }
    
    async storewideDiscount(percentageDiscount) {
        const products = await productDataLayer.getAllProducts()
        for (let eachProduct of products) {
            eachProduct.set('discounted_price', product.price * ((100-percentageDiscount)/100))
            await eachProduct.save()
            return eachProduct
        }
        
    }
}
module.exports = productServices