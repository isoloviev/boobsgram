/*
 * GET home page.
 */
var userRoles = require('../public/js/modules/routingConfig').userRoles;

exports.index = function (req, res) {
    var role = userRoles.public, username = '';
    var user = req.user;
    if (!user) {
        user = {
            role: role,
            username: username
        }
    }
    console.log("User is logged");
    console.log(user);
    res.cookie('user', JSON.stringify(user));
    res.render('index', {
        title: 'Boobsgram - Share your boobs. The best collection of boobs.',
        appConfig: {isProduction: false},
        loggedUser: req.user
    });
};

exports.logout = function(req, res) {
    req.logout();
    res.send(200);
};