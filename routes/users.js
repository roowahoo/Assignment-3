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

module.exports = router;