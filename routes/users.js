const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { createRegistrationForm, bootstrapField, createLoginForm } = require('../forms')
const crypto = require('crypto')

const getHashedPassword=(password)=>{
    const sha256=crypto.createHash('sha256')
    const hash=sha256.update(password).digest('base64')
    return hash
}

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
            let {confirm_password,...userData}=form.data
            userData.password=getHashedPassword(userData.password)
            const newUser=new User(userData)
            // const user=new User({
            //     'username':form.data.username,
            //     'email':form.data.email,
            //     'password':getHashedPassword(form.data.password)
            // })
            await newUser.save()
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
    const loginForm=createLoginForm()
    res.render('users/login',{
        'form':loginForm.toHTML(bootstrapField)
    })
})

router.post('/login',(req,res)=>{
    const loginForm=createLoginForm()
    loginForm.handle(req,{
        'success':async(form)=>{
            let user=await User.where({
                'email':form.data.email
            }).fetch({
                require:false
            })
            if (user){
                if(user.get('password')===getHashedPassword(form.data.password)){
                    req.session.user={
                        id:user.get('id'),
                        username:user.get('username'),
                        email:user.get('email'),
                    }
                    req.flash('success_messages','Login successful')
                    res.redirect('/')
                }else{
                    req.flash('error_messages','Password is invalid')
                    res.redirect('/users/login')
                }
            }else{
                req.flash('error_messages','User not found')
                res.redirect('/users/login')
            }
        },
        'error':(form)=>{
            res.render('users/login',{
                'form':loginForm.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/logout',(req,res)=>{
    req.session.user=null
    req.flash('success_messages','Goodbye')
    res.redirect('/users/login')
})


module.exports = router;