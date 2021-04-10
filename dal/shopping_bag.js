const {Bag}=require('../models')

const getBagItems=async(userId)=>{
    return await Bag.collection().where({
        'user_id':userId
    }).fetch({
        require:false,
        withRelated:['products','products.category']
    })
}

const getBagItemByUserAndProduct=async(userId,productId)=>{
    const bagItem=await Bag.where({
        'user_id':userId,
        'product_id':productId
    }).fetch({
        require:false,
        withRelated:['products','products.category']
    })
    return bagItem
}

module.exports={getBagItems,getBagItemByUserAndProduct}