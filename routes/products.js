const express =require('express')
const router=express.Router()

const {Product}=require('../models')

router.get('/',async (req,res)=>{
    let products=await Product.collection().fetch()
    res.render('shop/index',{
        'products':products.toJSON()
    })
    console.log(products.toJSON())
})
module.exports=router