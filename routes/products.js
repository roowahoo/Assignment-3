const express = require('express')
const router = express.Router()

const { Product } = require('../models')
const { bootstrapField, createProductForm, createSearchForm } = require('../forms')
const { checkIfAuthenticated } = require('../middlewares')

//import DAL
const productDataLayer = require('../dal/product')
//import services
const productServices=require('../services/product_services')


router.get('/shop', async (req, res) => {

    const allCategories = await productDataLayer.getAllCategories()
    allCategories.unshift([0, '----'])
    const allSkintypes = await productDataLayer.getAllSkintypes()
    allSkintypes.unshift([0, '----'])
    const allBrands = await productDataLayer.getAllBrands()
    allBrands.unshift([0, '----'])
    const allTags = await productDataLayer.getAllTags()
    const searchForm = createSearchForm(allCategories, allSkintypes, allBrands, allTags);
    let queries = Product.collection()


    searchForm.handle(req, {
        'empty': async (form) => {
            let results = await queries.fetch({
                withRelated: ['category', 'skintype', 'brand', 'tags']
            })
            res.render('shop/index', {
                'products': results.toJSON(),
                'form': form.toHTML(bootstrapField)

            })

        },
        'success': async (form) => {
            if (form.data.name) {
                queries = queries.where('name', 'like', '%' + form.data.name + '%')
                console.log(queries)
            }
            if (form.data.min_price) {

                queries = queries.where('price', '>=', form.data.min_price)
            }
            if (form.data.max_price) {

                queries = queries.where('price', '<=', form.data.max_price)
            }
            if (form.data.stock) {

                queries = queries.where('stock', '>=', form.data.stock)
            }
            if (form.data.date_of_manufacture) {

                queries = queries.where('date_of_manufacture', '=', form.data.date_of_manufacture)
            }
            if (form.data.category_id !== '0') {
                queries = queries.where('category_id', '=', form.data.category_id)
            }
            if (form.data.skintype_id !== '0') {
                queries = queries.where('skintype_id', '=', form.data.skintype_id)
            }
            if (form.data.brand_id !== '0') {
                queries = queries.where('brand_id', '=', form.data.brand_id)
            }
            if (form.data.tags) {
                queries = queries.query('join', 'products_tags', 'id', 'product_id').where('tag_id', 'in', form.data.tags.split(','))
            }

            let results = await queries.fetch({
                withRelated
                : ['category', 'skintype', 'brand', 'tags']
            })
            // console.log(queries)
            res.render('shop/index', {
                'products': results.toJSON(),
                'form': form.toHTML(bootstrapField)

            })


        },
        'error': async (form) => {
            let results = await products.fetch({
                withRelated: ['category', 'skintype', 'brand', 'tags']
            })
            res.render('shop/index', {
                'products': results.toJSON(),
                'form': form.toHTML(bootstrapField)

            })

        }
    })

    // let products=await Product.collection().fetch({
    //     withRelated:['category','skintype','brand','tags']
    // })
    // res.render('shop/index',{
    //     'products':products.toJSON()
    // })
    // console.log(products.toJSON())
})

router.get('/create', async (req, res) => {
    const allCategories = await productDataLayer.getAllCategories()
    const allSkintypes = await productDataLayer.getAllSkintypes()
    const allBrands = await productDataLayer.getAllBrands()
    const allTags = await productDataLayer.getAllTags()
    const productForm = createProductForm(allCategories, allSkintypes, allBrands, allTags);
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', async (req, res) => {
    const allCategories = await productDataLayer.getAllCategories()
    const allSkintypes = await productDataLayer.getAllSkintypes()
    const allBrands = await productDataLayer.getAllBrands()
    const allTags = await productDataLayer.getAllTags()

    const productForm = createProductForm(allCategories, allSkintypes, allBrands, allTags);

    productForm.handle(req, {
        'success': async (form) => {
            let { tags, ...productData } = form.data
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
            req.flash('success_messages', `New Product ${newProduct.get('name')} has been created`)
            res.redirect('/products/shop')

        },
        'error': async (form) => {
            req.flash('error_messages', 'Error creating product')
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })

        }
    })
})

router.get('/:product_id/update',  async (req, res) => {
    const allCategories = await productDataLayer.getAllCategories()
    const allSkintypes = await productDataLayer.getAllSkintypes()
    const allBrands = await productDataLayer.getAllBrands()
    const allTags = await productDataLayer.getAllTags()

    const productToEdit = await productDataLayer.getProductById(req.params.product_id)
    const productJSON = productToEdit.toJSON()
    console.log(productJSON)
    const selectedTagIds = productJSON.tags.map(t => t.id)

    const productForm = createProductForm(allCategories, allSkintypes, allBrands, allTags);

    productForm.fields.name.value = productToEdit.get('name');
    productForm.fields.description.value = productToEdit.get('description');
    productForm.fields.directions.value = productToEdit.get('directions');
    productForm.fields.ingredients.value = productToEdit.get('ingredients');
    productForm.fields.net_weight.value = productToEdit.get('net_weight');
    productForm.fields.price.value = productToEdit.get('price');
    productForm.fields.stock.value = productToEdit.get('stock');
    productForm.fields.date_of_manufacture.value = productToEdit.get('date_of_manufacture');
    productForm.fields.category_id.value = productToEdit.get('category_id');
    productForm.fields.skintype_id.value = productToEdit.get('skintype_id');
    productForm.fields.brand_id.value = productToEdit.get('brand_id');
    productForm.fields.tags.value = selectedTagIds


    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': productToEdit.toJSON()
    })
})

router.post('/:product_id/update', async (req, res) => {
    const productToEdit = await productDataLayer.getProductById(req.params.product_id)
    const productJSON = productToEdit.toJSON()
    const existingTagIds = productJSON.tags.map(t => t.id)

    const productForm = createProductForm()
    productForm.handle(req, {
        'success': async (form) => {
            let { tags, ...productData } = form.data
            productToEdit.set(productData)
            productToEdit.save()
            let newTagsId = tags.split(',')
            productToEdit.tags().detach(existingTagIds)
            productToEdit.tags().attach(newTagsId)
            req.flash('success_messages', `Product ${productToEdit.get('name')} has been updated`)
            res.redirect('/products/shop')
        },
        'error': async (form) => {
            req.flash('error_messages', 'Error updating product')
            res.render('products/update', {
                'form': productForm.toHTML(bootstrapField)
            })

        }
    })

})

router.get('/:product_id/delete', async (req, res) => {
    const productToDelete = await productDataLayer.getProductById(req.params.product_id)
    res.render('products/delete', {
        'product': productToDelete
    })
})

router.post('/:product_id/delete', async (req, res) => {
    const productToDelete = await productDataLayer.getProductById(req.params.product_id)
    await productToDelete.destroy();
    res.redirect('/products/shop')
})



router.get('/endPromo', async (req,res)=>{
    let products=new productServices()
    await products.endDiscount()
    req.flash('success_messages','Promotion ended')
    res.redirect('/products/shop')
})

module.exports = router