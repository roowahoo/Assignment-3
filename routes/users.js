const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { createRegistrationForm, bootstrapField } = require('../forms')

router.get('/register', (req, res) => {
    const registrationForm = createRegistrationForm();
    res.render('users/register', {
        'form': registrationForm.toHTML(bootstrapField)
    })
})

router.post('/register',(req,res)=>{
    const registrationForm=createRegistrationForm()
    registrationForm.handle(req,{
        'success':async(form)=>{
            const user=new User({
                'username':form.data.username,
                'email':form.data.email,
                'password':form.data.password
            })
            await user.save()
            req.flash('success_messages','Thank you for signing up')
            res.redirect('/users/login')
        },
        'error':async(form)=>{
            res.render('users/register',{
                'form':form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', (req, res) => {
    
    res.render('users/login')
})


module.exports = router;