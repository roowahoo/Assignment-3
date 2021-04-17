const { Vendor } = require('../models')

const getVendor = async (email) => {
    const currentVendor = await Vendor.where({
        'email': email
    }).fetch({
        require: false
    })
    return currentVendor
}
module.exports = {
    getVendor
}