var passport = require('passport'),
    User = require('../models/User');

module.exports.login = function(req, res, next) {
    passport.authenticate('local',
        function(err, user, info) {
            return err
                ? next(err)
                : user
                ? req.logIn(user, function(err) {
                return err
                    ? next(err)
                    : res.redirect('/');
            })
                : res.redirect('/');
        }
    )(req, res, next);
};

module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

module.exports.register = function(req, res, next) {
    var user = new User({ username: req.body.email, password: req.body.password});
    user.save(function(err) {
        return err
            ? next(err)
            : req.logIn(user, function(err) {
            return err
                ? next(err)
                : res.redirect('/upload');
        });
    });
};

module.exports.mustAuthenticatedMw = function (req, res, next){
    req.isAuthenticated()
        ? next()
        : res.redirect('/');
};