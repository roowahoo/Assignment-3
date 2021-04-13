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

router.post('/login', (req, res) => {
    const loginForm = createLoginForm()
    loginForm.handle(req, {
        'success': async (form) => {
            let shopper = await Shopper.where({
                'email': req.body.email
            }).fetch({
                require: false
            })
            if (shopper) {
                if (shopper.get('password') === getHashedPassword(req.body.password)) {
                    // req.session.user = {
                    //     id: vendor.get('id'),
                    //     username: vendor.get('username'),
                    //     email: vendor.get('email'),
                    // }
                    res.send(shopper)
                } else {
                    res.send('Invalid Password')
                }
            } else {
                res.send('No user found')
            }
        },
        'error': (form) => {
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

