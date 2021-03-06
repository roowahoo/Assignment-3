const express = require('express')
const router = express.Router()
const { Orders, OrderItems, Shopper } = require('../models')
const { bootstrapField, createOrderSearchForm, editOrderForm } = require('../forms')
const { checkIfAuthenticated } = require('../middlewares')
const ordersAccessLayer = require('../dal/orders')
const shoppersAccessLayer = require('../dal/shoppers')


router.get('/', checkIfAuthenticated, async (req, res) => {
    const searchForm = createOrderSearchForm()
    let queries = OrderItems.collection()

    searchForm.handle(req, {
        'empty': async (form) => {
            let results = await queries.query(function (order) {
                order.groupBy('order_id').select('order_id')
            }).fetch({
                withRelated: ['orders', 'products', 'orders.shoppers']
            })


            res.render('orders/index', {
                'orders': results.toJSON(),
                'form': form.toHTML(bootstrapField),
            })

        },
        'success': async (form) => {

            if (form.data.product_name) {
                queries = queries.query('join', 'products', 'product_id', 'products.id').where('name', 'like', '%' + form.data.product_name + '%')
            }
            if (form.data.amount && form.data.status !== 'null') {
                queries = queries.query('join', 'orders', 'order_id', 'orders.id').where('amount', '>=', form.data.amount).where('status', '=', form.data.status)
            }
            if (form.data.amount && form.data.status === 'null') {
                queries = queries.query('join', 'orders', 'order_id', 'orders.id').where('amount', '>=', form.data.amount)
            }
            if (form.data.status !== 'null' && !form.data.amount) {
                queries = queries.query('join', 'orders', 'order_id', 'orders.id').where('status', '=', form.data.status)
            }

            let results = await queries.query(function (order) {
                order.groupBy('order_id').select('order_id')
            }).fetch({
                withRelated: ['orders', 'products', 'orders.shoppers']
            })
            console.log(results.toJSON())
            res.render('orders/index', {
                'orders': results.toJSON(),
                'form': form.toHTML(bootstrapField),
            })


        },
        'error': async (form) => {
            let results = await queries.query(function (order) {
                order.groupBy('order_id').select('order_id')
            }).fetch({
                withRelated: ['orders', 'products', 'orders.shoppers']
            })

            res.render('orders/index', {
                'orders': results.toJSON(),
                'form': form.toHTML(bootstrapField),
            })

        }
    })
})

router.get('/:order_id', checkIfAuthenticated, async (req, res) => {
    let currentOrder = await ordersAccessLayer.getOrderItemsByOrderId(req.params.order_id)
    let orderDetails = await ordersAccessLayer.getOrderById(req.params.order_id)
    // console.log(currentOrder.toJSON())
    console.log(orderDetails.toJSON())
    res.render('orders/orderDetails', {
        'products': currentOrder.toJSON(),
        'order': orderDetails.toJSON()
    })
})

router.get('/:order_id/update', checkIfAuthenticated, async (req, res) => {
    const orderToEdit = await ordersAccessLayer.getOrderById(req.params.order_id)
    // res.send(orderToEdit)
    // const editForm = editOrderForm()
    // editForm.fields.customer_name.value = orderToEdit.related('shoppers').get('username')
    // editForm.fields.shipping_address.value = orderToEdit.get('shipping_address')
    // editForm.fields.email.value = orderToEdit.related('shoppers').get('email')
    // editForm.fields.contact.value = orderToEdit.get('contact_number')
    // editForm.fields.status.value = orderToEdit.get('status')

    res.render('orders/update', {
        'order': orderToEdit.toJSON(),
        // 'form': editForm.toHTML(bootstrapField)
    })
    
})

router.post('/:order_id/update',checkIfAuthenticated, async (req, res) => {
    const orderToEdit = await ordersAccessLayer.getOrderById(req.params.order_id)

    orderToEdit.set('shipping_address', req.body.shipping_address)
    orderToEdit.set('status', req.body.status)
    orderToEdit.save()
    req.flash('success_messages', `Order ${orderToEdit.get('id')} has been updated`)
    res.redirect('/orders')

})

router.get('/:order_id/delete', checkIfAuthenticated, async (req,res)=>{
    const orderToDelete = await ordersAccessLayer.getOrderById(req.params.order_id)
    res.render('orders/delete',{
        'order':orderToDelete
    })

})

router.post('/:order_id/delete',checkIfAuthenticated, async (req,res)=>{
    const orderItemsToDelete=await ordersAccessLayer.getOrderItemsByOrderId(req.params.order_id)
    const orderToDelete = await ordersAccessLayer.getOrderById(req.params.order_id)
    console.log(orderItemsToDelete.toJSON())
    for(let item of orderItemsToDelete){
        await item.destroy()
    }
    await orderToDelete.destroy()
    req.flash('success_messages', `Order has been deleted`)
    res.redirect('/orders')
})



module.exports = router