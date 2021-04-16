const express = require('express')
const router = express.Router()
const { Orders,OrderItems } = require('../models')
const { bootstrapField, createOrderSearchForm } = require('../forms')
const { checkIfAuthenticated } = require('../middlewares')
const ordersAccessLayer = require('../dal/orders')

router.get('/',(req,res)=>{
    const searchForm=createOrderSearchForm()
    let queries=OrderItems.collection()
    searchForm.handle(req,{
        'empty':async (form)=>{
            let results=await queries.fetch({
                withRelated:['orders']
            })
            res.render('orders/index',{
                'orders':results.toJSON(),
                'form':form.toHTML(bootstrapField)
            })

        },
        'sucess':async(form)=>{

        },
        'error':async(form)=>{

        }
    })
})

module.exports=router