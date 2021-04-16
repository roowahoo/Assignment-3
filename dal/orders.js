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

const getOrderDetails=async ()=>{
    const details=await OrderItems.fetchAll().map((orders)=>{
        return [orders.get('shopper_id'),orders.get('shipping_address'),orders.get('contact_number'),orders.get('date'),orders.get('amount'),orders.get('status')]
    })
    return details
}


module.exports={
    getOrderIdByUserId,
    getOrderDetails
}