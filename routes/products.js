const express =require('express')
const router=express.Router()

const {Product}=require('../models')
const { bootstrapField, createProductForm } = require('../forms')

//import DAL
const productDataLayer=require('../dal/product')

router.get('/shop',async (req,res)=>{
    let products=await Product.collection().fetch({
        withRelated:['category','skintype']
    })
    res.render('shop/index',{
        'products':products.toJSON()
    })
    console.log(products.toJSON())
})

router.get('/create', async (req, res) => {
    const allCategories = await productDataLayer.getAllCategories()
    const productForm = createProductForm(allCategories);
    res.render('products/create',{
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create',  async(req,res)=>{
    const allCategories = await productDataLayer.getAllCategories()

    const productForm = createProductForm(allCategories);

    productForm.handle(req, {
        'success': async (form) => {
            const newProduct = new Product();
            newProduct.set('name',form.data.name)
            newProduct.set('description',form.data.description)
            newProduct.set('directions',form.data.directions)
            newProduct.set('ingredients',form.data.ingredients)
            newProduct.set('net_weight',form.data.net_weight)
            newProduct.set('price',form.data.price)
            newProduct.set('stock',form.data.stock)
            newProduct.set('date_of_manufacture',form.data.date_of_manufacture)
            newProduct.set('category_id',form.data.category_id)
            await newProduct.save();
            res.redirect('/products/shop')
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
module.exports=router