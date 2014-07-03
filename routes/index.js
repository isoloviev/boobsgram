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
    var cookies = parseCookies(req);
    res.render('index', {
        title: 'Boobsgram - Share your boobs. The best collection of boobs.',
        appConfig: {isProduction: false},
        loggedUser: req.user,
        showAdultWarning: cookies['termsAccepted'] != 'Y'
    });
};

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });

    return list;
}

exports.logout = function (req, res) {
    req.logout();
    res.send(200);
};