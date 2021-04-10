const express = require('express');
const router = express.Router();

const BagServices = require('../services/bag_services');

router.get('/',async (req,res)=>{
    let bag=new BagServices(req.session.user.id)
    const allItems = await bag.getAllItemsInBag()
    console.log(allItems.toJSON())
    res.render('shop/bag',{
        'bag':allItems.toJSON()
    })
})

router.get('/:product_id/add',async(req,res)=>{
    let bag=new BagServices(req.session.user.id)
    await bag.addToBag(req.params.product_id)
    req.flash('success_messages','Added to bag')
    res.redirect('back')
})

module.exports=router