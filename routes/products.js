const express =require('express')
const router=express.Router()

const {Product}=require('../models')
const { bootstrapField, createProductForm } = require('../forms')

//import DAL
const productDataLayer=require('../dal/product')

router.get('/shop',async (req,res)=>{
    let products=await Product.collection().fetch({
        withRelated:['category','skintype','brand','tag']
    })
    res.render('shop/index',{
        'products':products.toJSON()
    })
    console.log(products.toJSON())
})

router.get('/create', async (req, res) => {
    const allCategories = await productDataLayer.getAllCategories()
    const allSkintypes = await productDataLayer.getAllSkintypes()
    const allBrands = await productDataLayer.getAllBrands()
    const allTags = await productDataLayer.getAllTags()
    const productForm = createProductForm(allCategories,allSkintypes,allBrands,allTags);
    res.render('products/create',{
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create',  async(req,res)=>{
    const allCategories = await productDataLayer.getAllCategories()
    const allSkintypes = await productDataLayer.getAllSkintypes()
    const allBrands = await productDataLayer.getAllBrands()
    const allTags = await productDataLayer.getAllTags()

    const productForm = createProductForm(allCategories,allSkintypes,allBrands,allTags);

    productForm.handle(req, {
        'success': async (form) => {
            let {tags,...productData}=form.data
            const newProduct = new Product();
            newProduct.set(productData)
            // newProduct.set('name',form.data.name)
            // newProduct.set('description',form.data.description)
            // newProduct.set('directions',form.data.directions)
            // newProduct.set('ingredients',form.data.ingredients)
            // newProduct.set('net_weight',form.data.net_weight)
            // newProduct.set('price',form.data.price)
            // newProduct.set('stock',form.data.stock)
            // newProduct.set('date_of_manufacture',form.data.date_of_manufacture)
            // newProduct.set('category_id',form.data.category_id)
            // newProduct.set('skintype_id',form.data.skintype_id)
            // newProduct.set('brand_id',form.data.brand_id)


            await newProduct.save();
            if (tags) {
                await newProduct.tags().attach(tags.split(","))
            }
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