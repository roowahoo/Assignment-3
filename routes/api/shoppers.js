const express = require('express')
const router = express.Router()
const { Shopper } = require('../../models')
const { createRegistrationForm, bootstrapField, createLoginForm } = require('../../forms')
const crypto = require('crypto')

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256')
    const hash = sha256.update(password).digest('base64')
    return hash
}

router.post('/register', (req, res) => {
    const registrationForm = createRegistrationForm()
    registrationForm.handle(req, {
        'success': async (form) => {
            let { confirm_password, ...shopperData } = form.data
            shopperData.password = getHashedPassword(shopperData.password)
            const newShopper = new Shopper(shopperData)
            
            await newShopper.save()
            res.send(newShopper)
        },
        'error': async (form) => {
            let errors = {};
           for (let key in form.fields) {
               if (form.fields[key].error) {
                   errors[key] = form.fields[key].error;
               }
           }
           res.send(JSON.stringify(errors));
        }
    })
})

module.exports=router

