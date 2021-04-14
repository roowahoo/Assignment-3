const { Orders} = require('../models')

const getOrderIdByUserId = async (userId)=>{
    const order=await Orders.collection().where({
        'shopper_id':userId
    }).fetch({
        require:true
    }).limit(1)
    return order

}
module.exports={
    getOrderIdByUserId
}