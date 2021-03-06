const express = require('express')
const router = express.Router()

const { checkIfAuthenticated } = require('../middlewares')

//import services
const productServices=require('../services/product_services')

router.get('/', checkIfAuthenticated, async (req,res)=>{
    let products=new productServices()
    const allProducts = await products.getAllProducts()
    res.render('products/promo',{
        'products':allProducts
    })

})

router.post('/', checkIfAuthenticated, async (req,res)=>{
    // console.log(req.body)
    let products=new productServices()
    await products.storewideDiscount(req.body.discount)
    req.flash('success_messages','Promotion applied')
    res.redirect('/products/shop')
})

router.get('/end', checkIfAuthenticated, async (req,res)=>{
    let products=new productServices()
    await products.endDiscount()
    req.flash('success_messages','Promotion ended')
    res.redirect('/products/shop')
})

module.exports = router