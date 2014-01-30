/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var users = require('./routes/users');
var photos = require('./routes/photos');
var http = require('http');
var path = require('path');
var passport = require('passport');
var mongoose = require('mongoose'),
    config = require('./config.json');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'BOOBS-ME' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (username, password, done) {
    User.findOne({ username: username}, function (err, user) {
        return err
            ? done(err)
            : user
            ? password === user.password
            ? done(null, user)
            : done(null, false, { message: 'Incorrect password.' })
            : done(null, false, { message: 'Incorrect username.' });
    });
}));

passport.serializeUser(function (user, done) {
    console.log("serialized: " + user._id);
    done(null, user._id);
});


passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        err
            ? done(err)
            : done(null, user);
    });
});

var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: config.facebook.APP_ID,
        clientSecret: config.facebook.APP_SECRET,
        callbackURL: config.facebook.APP_CALLBACK
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        User.findOne({accountId: profile.provider + '-' + profile.id}, function(err, oldUser) {
            if (err) { done(err); return; }
            if (oldUser) {
                done(null, oldUser);
            } else {
                var userRoles = require('./public/js/modules/routingConfig').userRoles;
                var user = new User();
                user.accountId = profile.provider + '-' + profile.id;
                user.name = profile.displayName;
                if (profile.emails)
                    user.email = profile.emails[0].value;
                user.gender = profile.gender;
                user.role = userRoles['user'];
                user.save(function(err) {
                    if (err) { done(err); return; }
                    done(null, user);
                });
            }
        });
    }
));

mongoose.set('debug', true);

mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db, null, function (err, db) {
    if (err) {
        console.log('Sorry, there is no mongo db server running.');
    } else {
        var attachDB = function (req, res, next) {
            req.db = db;
            next();
        };
        app.get('/', attachDB, routes.index);
        app.get('/404', routes.index);
        app.get('/login', routes.index);
        app.post('/logout', routes.logout);
        // single photo view
        app.get('/p/:photoId', routes.index);

        app.get('/upload.html', attachDB, routes.index);
        app.post('/login', attachDB, users.login);
        app.post('/register', attachDB, users.register);
        app.get('/logout', attachDB, users.logout);


        // graphic processor
        app.get('/gim/:width([0-9]{2,5})x:height([0-9]{2,5})/:filename', attachDB, photos.image);
        app.get('/gim/:width([0-9]{2,5})x:height([0-9]{2,5})/:type/:filename', attachDB, photos.image);

        // REST
        app.post('/api/upload/', attachDB, photos.upload);
        app.get('/api/photos/', attachDB, photos.list);
        app.get('/api/photo/:photoId', photos.item);
        app.post('/api/photo/:photoId/comment', photos.postComment);
        app.get('/api/photo/:photoId/comments', photos.comments);


        // facebook
        app.get('/auth/facebook', passport.authenticate('facebook', {display: 'touch'}));
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', { successRedirect: '/',
                failureRedirect: '/login' }));

        http.createServer(app).listen(app.get('port'), function () {
            console.log('Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
                '\nExpress server listening on port ' + app.get('port'));
        });
    }
});