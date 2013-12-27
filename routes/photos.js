var passport = require('passport'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    path = require('path'),
    User = require('../models/User'),
    Photo = require('../models/Photo');

module.exports.upload = function (req, res, next) {

    fs.readFile(req.files.file.path, function (err, data) {
        var fileName = uuid.v1() + '.jpg';
        var newPath = "./uploads/" + fileName;
        fs.writeFile(newPath, data, function (err) {
            if (err != null) {
                console.log(err);
                res.send(500);
                return;
            }
            var p = new Photo();
            p.name = req.files.file.name;
            p.fileName = fileName;
            p.dateAdded = new Date();
            p.user = "Major";
            p.save(function () {
                res.send(200);
            });
        });
    });

};


module.exports.list = function (req, res, next) {

    var limit = req.param('next', 10);
    var skip = limit - 10;
    if (skip < 0) {
        skip = 0;
        limit = 10;
    }

    Photo
        .find()
        .skip(skip)
        .limit(limit)
        .sort('-dateAdded')
        .exec(function (err, list) {
            if (err) {
                console.log(err);
                return;
            }
            res.json(200, { list: list });
        });
};

module.exports.image = function (req, res, next) {
    console.log('%s X %s ; %s', req.params.width, req.params.height, req.params.filename);

    var gm = require('gm')
        , resizeX = req.params.width
        , resizeY = req.params.height;

    console.log(path.join(__dirname, '..', 'uploads', req.params.filename));
    gm(path.join(__dirname, '..', 'uploads', req.params.filename))
        .blur(30, 20)
        .resize(resizeX, resizeY)
        .autoOrient()
        .stream(function streamOut(err, stdout, stderr) {
            if (err) return next(err);
            stdout.pipe(res); //pipe to response

            // the following line gave me an error compaining for already sent headers
            //stdout.on('end', function(){res.writeHead(200, { 'Content-Type': 'ima    ge/jpeg' });});

            stdout.on('error', next);
        });
};