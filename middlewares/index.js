const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash('error_messages', 'Please Login');
        res.redirect('/users/login');
    }
}

module.exports={
    checkIfAuthenticated
}