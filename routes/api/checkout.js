const express = require('express');
const router = express.Router();
const BagServices = require('../../services/bag_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const bodyParser = require('body-parser')
const ordersAccessLayer = require('../../dal/orders')

router.get('/:user_id', async (req, res) => {
    const bag = new BagServices(req.params.user_id)
    let bagItems = await bag.getAllItemsInBag()
    let orderItems = []
    let meta = []
    for (let item of bagItems) {
        const orderItem = {
            'name': item.related('products').get('name'),
            'amount': item.related('products').get('price'),
            'quantity': item.get('quantity'),
            'currency': 'SGD'
        }
        if (item.related('products').get('image_url')) {
            orderItem.images = [item.related('products').get('image_url')]
        }
        orderItems.push(orderItem)
        meta.push({
            'product_id': item.get('product_id'),
            'quantity': item.get('quantity'),
        })
    }
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        line_items: orderItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            'orders': metaData,
            'user_id': req.params.user_id
        }
    }
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('shop/checkout', {
        'sessionId': stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })

})

// Called by stripe not us
router.post('/process_payment', bodyParser.raw({ type: 'application/json' }),
    async (req, res) => {
        let payload = req.body
        let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET
        let sigHeader = req.headers['stripe-signature']
        let event;
        try {
            event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);

        } catch (e) {
            res.send({
                'error': e.message
            })
            console.log(e.message)
        }
        if (event.type == 'checkout.session.completed') {
            let stripeSession = event.data.object;

            if (stripeSession.payment_status === 'paid') {
                metadata = JSON.parse(stripeSession.metadata.orders)
                console.log(metadata)
                console.log(stripeSession.metadata.user_id)
                const currentOrder = await ordersAccessLayer.getOrderIdByUserId(stripeSession.metadata.user_id)
                currentOrder.set('status', 'Paid')
                currentOrder.save()
                let bag = new BagServices(stripeSession.metadata.user_id)
                const allItems = await bag.getAllItemsInBag()
                for (let product of metadata) {
                    console.log(product.product_id)
                    for (let item of allItems) {
                        await bag.removeFromBag(product.product_id)

                    }

                }


            }
            console.log(stripeSession);
            console.log('working')
        }
        res.send({ received: true })
    })
module.exports = router