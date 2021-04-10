const express = require('express');
const router = express.Router();

const BagServices = require('../services/bag_services');

router.get('/:product_id/add',async(req,res)=>{
    let bag=new BagServices(req.session.user.id)
    bag.addToBag(req.params.product_id,1)
    req.flash('success_messages','Added to cart')
    res.redirect('/products/shop')
})

module.exports=router