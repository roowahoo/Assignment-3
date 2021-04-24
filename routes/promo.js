const express = require('express')
const router = express.Router()

const { checkIfAuthenticated } = require('../middlewares')

//import services
const productServices=require('../services/product_services')

router.get('/',async (req,res)=>{
    let products=new productServices()
    const allProducts = await products.getAllProducts()
    res.render('products/promo',{
        'products':allProducts
    })

})

router.post('/',async (req,res)=>{
    // console.log(req.body)
    let products=new productServices()
    await products.storewideDiscount(req.body.discount)
    req.flash('success_messages','Promotion applied')
    res.redirect('/products/shop')
})

module.exports = router