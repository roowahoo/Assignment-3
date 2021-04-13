const express = require('express')
const router = express.Router()

const { Orders, OrderItems } = require('../../models')

router.post('/',async (req,res)=>{
    let order=new Orders()
    order.set('user_id',req.body.user_id)
    order.set('shipping_address',req.body.shipping_address)
    order.set('contact_number',req.body.contact_number)
    // console.log(order)
    await order.save()
    res.send(order)
    
})

module.exports=router