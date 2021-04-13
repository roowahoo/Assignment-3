const express = require('express');
const router = express.Router();

const BagServices = require('../services/bag_services');
const { checkIfAuthenticated } = require('../middlewares')

router.get('/:user_id', async (req,res)=>{
    let bag=new BagServices(req.params.user_id)
    const allItems = await bag.getAllItemsInBag()
    // console.log(allItems.toJSON())
    res.send(allItems)
})

router.get('/:user_id/:product_id/add', async(req,res)=>{
    let bag=new BagServices(req.params.user_id)
    await bag.addToBag(req.params.product_id)
    res.send(bag)
})

router.get('/:product_id/remove',async (req,res)=>{
    let bag=new BagServices(req.session.user.id)
    await bag.removeFromBag(req.params.product_id)
    req.flash('success_messages','Removed from bag')
    res.redirect('/bag')
})

router.post('/:product_id/updateQuantity',async (req,res)=>{
    let bag=new BagServices(req.session.user.id)
    await bag.changeQuantity(req.params.product_id,req.body.newQuantity)
    req.flash('success_messages','Quantity updated')
    res.redirect('/bag')
})

module.exports=router