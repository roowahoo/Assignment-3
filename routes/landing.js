const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
    res.render('landing/welcome')
})

module.exports=router