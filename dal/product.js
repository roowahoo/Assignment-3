const { Product,Category, Skintype, Brand, Tag } = require('../models')
const getAllCategories = async () => {
    const allCategories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    });
    return allCategories
}

const getAllSkintypes = async () => {
    const allSkinTypes = await Skintype.fetchAll().map((skintype) => {
        return [skintype.get('id'), skintype.get('skintype')]
    })
    return allSkinTypes
}

const getAllBrands = async () => {
    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('brand')]
    })
    return allBrands
}

const getAllTags = async () => {
    const allTags = await Tag.fetchAll().map((tag) => {
        return [tag.get('id'), tag.get('tag')]
    })
    return allTags
}

const getProductById = async (productId)=>{
    const productToEdit=await Product.where({
        'id':productId
    }).fetch({
        require:true,
        withRelated:['tags']
    })
    return productToEdit

}

const getAllProducts = async ()=>{
    return await Product.fetchAll({
        withRelated:['tags']
    })

}




module.exports = {
    getAllCategories,
    getAllSkintypes,
    getAllBrands,
    getAllTags,
    getProductById,
    getAllProducts
}