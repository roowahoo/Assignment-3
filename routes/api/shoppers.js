const express = require('express')
const router = express.Router()
const { Shopper, BlacklistedToken } = require('../../models')
const { createRegistrationForm, bootstrapField, createLoginForm } = require('../../forms')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const { checkIfAuthenticatedJWT } = require('../../middlewares')

const shopperDataLayer = require('../../dal/shoppers')

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

router.post('/register', async (req, res) => {

    password = getHashedPassword(req.body.password)
    const newShopper = new Shopper()
    newShopper.set('username', req.body.username)
    newShopper.set('email', req.body.email)
    newShopper.set('address', req.body.address)
    newShopper.set('password', password)

    await newShopper.save()
    res.send(newShopper)

})

router.post('/login', async (req, res) => {

    let shopper = await Shopper.where({
        'email': req.body.email
    }).fetch({
        require: false
    })
    if (shopper) {
        if (shopper.get('password') == getHashedPassword(req.body.password)) {

            let accessToken = generateAccessToken({
                'username': shopper.get('username'),
                'email': shopper.get('email'),
                'id': shopper.get('id'),
                'address': shopper.get('address')
            }, process.env.TOKEN_SECRET, '15m')

            let refreshToken = generateAccessToken({
                'username': shopper.get('username'),
                'email': shopper.get('email'),
                'id': shopper.get('id'),
                'address': shopper.get('address')
            }, process.env.REFRESH_TOKEN_SECRET, '7d')
            res.status(200)
            res.send({
                accessToken, refreshToken
            })
        } else {
            res.send('Invalid Password')
        }
    } else {
        res.send('No user found')
    }

})


router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user;
    res.send(user);
})

router.post('/profile/:user_id/update', async (req, res) => {

    profileToEdit = await shopperDataLayer.getShopperById(req.params.user_id)
    console.log(profileToEdit.toJSON())
    password = getHashedPassword(req.body.password)

    profileToEdit.set('username', req.body.username)
    profileToEdit.set('address', req.body.address)
    profileToEdit.set('password', password)
    profileToEdit.save()
    res.send(profileToEdit)

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

router.post('/logout', async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            const token = new BlacklistedToken();
            token.set('token', refreshToken);
            token.set('date_created', new Date());
            await token.save();
            res.send({
                'message': 'logged out'
            })
        })

    }

})




module.exports = router

