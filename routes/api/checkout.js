const express = require('express')
const router = express.Router()

const { Orders, OrderItems, Bag } = require('../../models')
const BagServices = require('../../services/bag_services');
const ordersAccessLayer=require('../../dal/orders')

router.post('/:user_id',async (req,res)=>{
    let order=new Orders()
    order.set('shopper_id',req.params.user_id)
    order.set('shipping_address',req.body.shipping_address)
    order.set('contact_number',req.body.contact_number)
    order.set('date',new Date())
    order.set('amount',req.body.amount)
    order.set('status','Unpaid')
    await order.save()
    res.send(order)

})

router.get('/:user_id',async (req,res)=>{
    let order=new Orders()
    const currentOrder=await ordersAccessLayer.getOrderIdByUserId(req.params.user_id)
    // res.send(currentOrder)
    // console.log(currentOrder)

    let orderJson=currentOrder.toJSON()
    console.log(orderJson[0].id)


    let bag=new BagServices(req.params.user_id)
    const allItems = await bag.getAllItemsInBag()
    let orderItems=new OrderItems()
    for(let item of allItems){
        orderItems.set({
        'product_id':item.get('product_id'),
        'quantity':item.get('quantity'),
        'order_id':orderJson[0].id
        
    })
    }
    orderItems.save()
    res.send(orderItems)

})

module.exports=router