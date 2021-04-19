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
    
    async storewideDiscount(discount) {
        const products = await productDataLayer.getAllProducts()
        for (let eachProduct of products) {
            eachProduct.set('discounted_price', eachProduct.get('price') * ((100-discount)/100))
            await eachProduct.save()
        }
        // console.log(products.toJSON())
    }
}
module.exports = productServices