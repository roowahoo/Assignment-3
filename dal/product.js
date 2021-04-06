const {Category}=require('../models')
const getAllCategories=async()=>{
    const allCategories = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    });
    return allCategories
}




module.exports={
    getAllCategories
}