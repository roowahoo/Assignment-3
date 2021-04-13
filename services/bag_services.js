const { Bag } = require('../models')
const shoppingBagDataLayer = require('../dal/shopping_bag')

class BagServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async getAllItemsInBag() {
        const allItems = await shoppingBagDataLayer.getBagItems(this.user_id)
        return allItems
    }

    async addToBag(productId) {
        const item = await shoppingBagDataLayer.getBagItemByUserAndProduct(this.user_id, productId)
        if (!item) {
            let newItem = new Bag()
            newItem.set('product_id', productId)
            newItem.set('shopper_id', this.user_id)
            newItem.set('quantity', 1)
            await newItem.save()
            return newItem
        } else {
            item.set('quantity', item.get('quantity') + 1)
            await item.save()
            return item
        }
    }

    async removeFromBag(productId) {
        const item = await shoppingBagDataLayer.getBagItemByUserAndProduct(this.user_id, productId)
        if (item) {
            await item.destroy()
            return true
        }
        return false
    }

    async changeQuantity(productId, newQuantity) {
        const item = await shoppingBagDataLayer.getBagItemByUserAndProduct(this.user_id, productId)
        if (item) {
            item.set('quantity', newQuantity)
            await item.save()
            return item
        }
        return null
    }
}

module.exports = BagServices;