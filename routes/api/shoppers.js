const express = require('express')
const router = express.Router()
const { Shopper, BlacklistedToken } = require('../../models')
const { createRegistrationForm, bootstrapField, createLoginForm } = require('../../forms')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const { checkIfAuthenticatedJWT } = require('../../middlewares')

const generateAccessToken = (user, secret, expiresIn) => {
    return jwt.sign(user, secret, {
        expiresIn: expiresIn
    });
}

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
                    // let accessToken = generateAccessToken(shopper);
                    // res.send({
                    //     accessToken
                    // })

                    let accessToken = generateAccessToken({
                        'username': shopper.get('username'),
                        'email': shopper.get('email'),
                        'id': shopper.get('id')
                    }, process.env.TOKEN_SECRET, '15m')

                    let refreshToken = generateAccessToken({
                        'username': shopper.get('username'),
                        'email': shopper.get('email'),
                        'id': shopper.get('id')
                    }, process.env.REFRESH_TOKEN_SECRET, '7d')
                    res.send({
                        accessToken, refreshToken
                    })
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

router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user;
    res.send(user);
})

router.post('/refresh', async (req, res) => {
    let refreshToken = req.body.refreshToken
    if (!refreshToken) {
        res.sendStatus(401)
    }

    let blacklistedToken = await BlacklistedToken.where({
        'token': refreshToken
    }).fetch({
        require: false
    })
    if (blacklistedToken) {
        res.status(401)
        res.send('Token has expired')
        return
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, shopper) => {
        if (err) {
            res.sendStatus(403)
        } else {
            let accessToken = generateAccessToken({
                'username': shopper.username,
                'email': shopper.email,
                'id': shopper.id
            }, process.env.TOKEN_SECRET, '15m')
            res.send({
                accessToken
            })
        }
    })

})

module.exports = router

