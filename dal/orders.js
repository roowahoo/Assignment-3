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
        require:true,
        withRelated:['shoppers']
    })
    return order
}

const getOrderItemsByOrderId=async(orderId)=>{
    const orderItems=await OrderItems.collection().where({
        'order_id':orderId
    }).fetch({
        require:true,
        withRelated:['orders', 'products', 'orders.shoppers']
    })
    return orderItems
}


module.exports={
    getOrderIdByUserId,
    getOrderById,
    getOrderItemsByOrderId
}