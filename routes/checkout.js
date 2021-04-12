const express = require('express');
const router = express.Router();
const BagServices = require('../services/bag_services');
const Stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
router.get('/',async (req,res)=>{
    const bag=new BagServices(req.session.user.id)
    let bagItems=await bag.getAllItemsInBag()
    let orderItems=[]
    let meta=[]
    for (let item of bagItems){
        const orderItem={
            'name': item.related('products').get('name'),
            'amount': item.related('products').get('price'),
            'quantity': item.get('quantity'),
            'currency': 'SGD'
        }
        if (item.related('products').get('image_url')){
            orderItem.images=[item.related('products').get('image_url')]
        }
        orderItems.push(orderItem)
        meta.push({
            'product_id':item.get('product_id'),
            'quantity':item.get('quantity')
        })
    }
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        line_items: orderItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            'orders': metaData
        }
    }
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('shop/checkout', {
        'sessionId': stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
    

})
module.exports=router