const express = require('express')
const router = express.Router()
const { Orders, OrderItems, Shopper } = require('../models')
const { bootstrapField, createOrderSearchForm, editOrderForm } = require('../forms')
const { checkIfAuthenticated } = require('../middlewares')
const ordersAccessLayer = require('../dal/orders')
const shoppersAccessLayer = require('../dal/shoppers')


router.get('/', async (req, res) => {
    const searchForm = createOrderSearchForm()
    let queries = OrderItems.collection()
    // let results = await queries.fetch({
    //     withRelated: ['orders', 'products', "orders.shoppers"]
    // })
    // console.log(results)    
    // res.send(results.toJSON())

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
            if (form.data.amount && form.data.status !== 'null' ) {
                queries = queries.query('join', 'orders', 'order_id', 'orders.id').where('amount', '>=', form.data.amount).where('status', '=', form.data.status)
            }
            if (form.data.amount && form.data.status==='null') {
                queries = queries.query('join', 'orders', 'order_id', 'orders.id').where('amount', '>=', form.data.amount)
            }
            if (form.data.status !== 'null' && !form.data.amount) {
                queries = queries.query('join', 'orders', 'order_id', 'orders.id').where('status', '=', form.data.status)
            }

            try {
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
                
                

            } catch (e) {
                res.render('orders/noResults')
            }

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

router.get('/:order_id/update', async (req, res) => {
    const orderToEdit = await ordersAccessLayer.getOrderById(req.params.order_id)
    // res.send(orderToEdit)
    const editForm = editOrderForm()
    editForm.fields.shipping_address.value = orderToEdit.get('shipping_address')
    editForm.fields.amount.value = orderToEdit.get('amount')
    editForm.fields.status.value = orderToEdit.get('status')

    res.render('orders/update', {
        'order': orderToEdit.toJSON(),
        'form':editForm.toHTML(bootstrapField)
    })
})



module.exports = router