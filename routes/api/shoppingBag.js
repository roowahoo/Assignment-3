const express = require('express');
const router = express.Router();

const BagServices = require('../../services/bag_services');
const { checkIfAuthenticated } = require('../../middlewares')

router.get('/:user_id', async (req,res)=>{
    let bag=new BagServices(req.params.user_id)
    const allItems = await bag.getAllItemsInBag()
    res.send(allItems)
})

router.get('/:user_id/:product_id/add', async(req,res)=>{
    let bag=new BagServices(req.params.user_id)
    await bag.addToBag(req.params.product_id)
    res.send(bag)
})

router.get('/:user_id/:product_id/remove',async (req,res)=>{
    let bag=new BagServices(req.params.user_id)
    await bag.removeFromBag(req.params.product_id)
    res.send(bag)
})

router.post('/:user_id/:product_id/updateQuantity',async (req,res)=>{
    let bag=new BagServices(req.params.user_id)
    await bag.changeQuantity(req.params.product_id,req.body.newQuantity)
    res.send(bag)
})

module.exports=router