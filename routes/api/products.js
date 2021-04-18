const express = require('express')
const router = express.Router()

//import DAL
const productDataLayer = require('../../dal/product')

//import models
const {Product} = require('../../models')


router.get('/',async (req,res)=>{
    res.send(await productDataLayer.getAllProducts())
})



router.post('/',async (req,res)=>{
    const cats=productDataLayer.getAllCategories()
    const brands=productDataLayer.getAllBrands()
    const skintypes=productDataLayer.getAllSkintypes()
    const tags=productDataLayer.getAllTags()
    const createProductForm=createProductForm(cats,brands,skintypes,tags)

    createProductForm.handle(req,{
        'success':async (form)=>{
            let {tags,...productData}=form.data
            const product=new Product(productData)
            await product.save()

            if (tags){
                await product.tags().attach(tags.split(','))
            }
            res.send(product)
        },
        'error':async(form)=>{
            let errors={}
            for(let key in form.fields){
                if(form.fields[key].error){
                    error[key]=form.fields[key].error
                }
            }
            res.send(JSON.stringify(errors))
        }
    })
})
module.exports=router