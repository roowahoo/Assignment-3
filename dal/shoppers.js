const { Shopper } = require('../models')
const getShopperById=async(shopperId)=>{
    const shopper=await Shopper.where({
        'id':shopperId
    }).fetch({
        require:true,
    })
    return shopper
}
module.exports={
    getShopperById
}