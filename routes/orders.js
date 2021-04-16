const express = require('express')
const router = express.Router()
const { Orders, OrderItems, Shopper } = require('../models')
const { bootstrapField, createOrderSearchForm } = require('../forms')
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
            let results = await queries.fetch({
                withRelated: ['orders', 'products', 'orders.shoppers']
            })

            res.render('orders/index', {
                'orders': results.toJSON(),
                'form': form.toHTML(bootstrapField),
            })

        },
        'success': async (form) => {

        },
        'error': async (form) => {

        }
    })
})

module.exports = router