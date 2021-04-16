const { Orders, OrderItems} = require('../models')

const getOrderIdByUserId = async (userId)=>{
    const order=await Orders.where({
        'shopper_id':userId
    }).query(function(order){
        order.orderBy('id','DESC').limit(1)
    }).fetch({
        require:true
    })
    return order

}

const getOrderById =async(orderId)=>{
    const order=await Orders.where({
        'id':orderId
    }).fetch({
        require:true
    })
    return order
}


module.exports={
    getOrderIdByUserId,
    getOrderById
}