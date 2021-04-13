const express = require('express')
const router = express.Router()
const { Vendor } = require('../models')
const { createRegistrationForm, bootstrapField, createLoginForm } = require('../forms')
const crypto = require('crypto')

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256')
    const hash = sha256.update(password).digest('base64')
    return hash
}

router.get('/register', (req, res) => {
    const registrationForm = createRegistrationForm();
    res.render('vendors/register', {
        'form': registrationForm.toHTML(bootstrapField)
    })
})

router.post('/register', (req, res) => {
    const registrationForm = createRegistrationForm()
    registrationForm.handle(req, {
        'success': async (form) => {
            let { confirm_password, ...vendorData } = form.data
            vendorData.password = getHashedPassword(vendorData.password)
            const newVendor = new Vendor(vendorData)
            // const Vendor=new Vendor({
            //     'username':form.data.username,
            //     'email':form.data.email,
            //     'password':getHashedPassword(form.data.password)
            // })
            await newVendor.save()
            req.flash('success_messages', 'Thank you for signing up')
            res.redirect('/vendors/login')
        },
        'error': async (form) => {
            res.render('vendors/register', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', (req, res) => {
    const loginForm = createLoginForm()
    res.render('vendors/login', {
        'form': loginForm.toHTML(bootstrapField)
    })
})

router.post('/login', (req, res) => {
    const loginForm = createLoginForm()
    loginForm.handle(req, {
        'success': async (form) => {
            let vendor = await Vendor.where({
                'email': form.data.email
            }).fetch({
                require: false
            })
            if (vendor) {
                if (vendor.get('password') === getHashedPassword(form.data.password)) {
                    req.session.user = {
                        id: vendor.get('id'),
                        username: vendor.get('username'),
                        email: vendor.get('email'),
                    }
                    req.flash('success_messages', 'Login successful')
                    res.redirect('/vendors/profile')
                } else {
                    req.flash('error_messages', 'Password is invalid')
                    res.redirect('/vendors/login')
                }
            } else {
                req.flash('error_messages', 'User not found')
                res.redirect('/vendors/login')
            }
        },
        'error': (form) => {
            res.render('vendors/login', {
                'form': loginForm.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/profile', (req, res) => {
    const vendor = req.session.user
    if (!vendor) {
        req.flash('error_messages', 'You are not authorized to view this page')
        res.redirect('/vendors/login')
    } else {
        res.render('vendors/profile', {
            'vendor': vendor
        })
    }
})

router.get('/logout', (req, res) => {
    req.session.user = null
    req.flash('success_messages', 'Goodbye')
    res.redirect('/vendors/login')
})


module.exports = router;