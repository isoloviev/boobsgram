var passport = require('passport'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    path = require('path'),
    User = require('../models/User'),
    Photo = require('../models/Photo');

module.exports = {
    upload: function (req, res, next) {
        if (!req.user) {
            res.send(401);
            return;
        }

        var self = this;
        var gm = require('gm');


        var img = gm(req.files.file.path);
        img.size(function (err, size) {
            if (!err) {
                console.log('width = ' + size.width);
                console.log('height = ' + size.height);
                var w = size.width,
                    h = size.height,
                    s = w,
                    x = 0,
                    y = 0;

                // define the smallest side
                if (h < w) {
                    s = h;
                    x = (w - h) / 2;
                }

                if (h > w) {
                    y = (h - w) / 2;
                }

                console.log("size: %s, x: %s, y: %s", s, x, y);
                var fileName = uuid.v1() + '.jpg';
                var newPath = "./uploads/" + fileName;
                //crop by this side
                img.crop(s, s, x, y).stream(function (err, stdout, stderr) {
                    if (err) return next(err);
                    stdout.pipe(fs.createWriteStream(newPath));
                    setTimeout(function () {
                        var p = new Photo();
                        p.name = req.files.file.name;
                        p.fileName = fileName;
                        p.dateAdded = new Date();
                        p.user = req.user._id;
                        p.random_point = [Math.random(), 0];
                        p.save(function (err) {
                            if (err != null) {
                                res.send(500, err);
                                return;
                            }
                            // create preview
                            module.exports._imagePreview(fileName, newPath, 300, 300, false, function () {
                                module.exports._imagePreview(fileName, newPath, 300, 300, true, function () {
                                    module.exports._imagePreview(fileName, newPath, 600, 600, false, function () {
                                        res.send(200);
                                    });
                                });
                            });

                        });
                    }, 500);
                });

            }
        });


    },

    _imagePreview: function (img, src, w, h, blur, next) {
        var gm = require('gm')
            , resizeX = w
            , resizeY = h;
        var mkdirp = require('mkdirp');

        var tFileName = path.join(__dirname, '..', 'uploads', w + 'x' + h + (blur ? '-blur' : ''), img);
        mkdirp(path.dirname(tFileName), function () {
            var orient = gm(src)
                .resize(resizeX, resizeY)
                .autoOrient();
            if (blur) {
                orient.blur(30, 20);
            }
            orient
                .write(tFileName, function () {
                    next();
                });
        })
    },


    list: function (req, res, next) {

        var limit = 12;
        var skip = parseInt(req.param('next', 0));
        if (skip < 0) {
            skip = 0;
        }

        if (req.param('rnd')) {
            Photo
                .find({ random_point: { $near: [Math.random(), 0] } }, '-comments')
                .limit(12)
                .populate('user')
                .exec(function (err, list) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    res.json(200, { list: list });
                });
            return;
        }

        Photo
            .find(null, '-comments')
            .skip(skip)
            .limit(limit)
            .populate('user')
            .sort('-dateAdded')
            .exec(function (err, list) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.json(200, { list: list });
            });
    },

    image: function (req, res, next) {
        console.log('%s X %s ; %s', req.params.width, req.params.height, req.params.filename);
        var isBlurred = false;
        if (req.params.type) {
            console.log('with alias - ' + req.params.type);
            isBlurred = req.params.type == 'blur';
        }

        if (req.params.filename == '{{item.fileName}}') {
            res.send(404);
            return;
        }

        var gm = require('gm')
            , resizeX = req.params.width
            , resizeY = req.params.height;

        var tFileName = path.join(__dirname, '..', 'uploads', resizeX + 'x' + resizeY + (isBlurred ? '-blur' : ''), req.params.filename);

        if (fs.existsSync(tFileName)) {

            var stat = fs.statSync(tFileName);

            res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Content-Length': stat.size,
                'Cache-Control': 'max-age=86400, public',
                'Pragma': 'public'
            });

            var readStream = fs.createReadStream(tFileName);
            readStream.pipe(res);

        } else {

            module.exports._imagePreview(req.params.filename, path.join(__dirname, '..', 'uploads', req.params.filename), resizeX, resizeY, isBlurred, function () {
                if (!fs.existsSync(tFileName)) {
                    res.send(404);
                    return;
                }

                var stat = fs.statSync(tFileName);

                res.writeHead(200, {
                    'Content-Type': 'image/jpeg',
                    'Content-Length': stat.size,
                    'Cache-Control': 'max-age=86400, public',
                    'Pragma': 'public'
                });

                var readStream = fs.createReadStream(tFileName);
                readStream.pipe(res);
            });

        }
    },

    postComment: function (req, res, next) {
        if (!req.user) {
            res.send(401);
            return;
        }
        console.log('User wants to post comment to photo %s', req.params.photoId);
        var post = req.body.comment;
        Photo.findOne({ _id: req.params.photoId}, function (err, photo) {
            photo.comments.push({
                body: post.body,
                date: new Date(),
                user: req.user._id
            });
            if (isNaN(photo.meta.comments)) {
                photo.meta.comments = 0;
            }
            photo.meta.comments++;
            photo.save(function (err) {
                res.json({ result: 'ok'});
            });
        });
    },

    item: function (req, res, next) {
        console.log('User wants to get info about photo %s', req.params.photoId);
        Photo.findOne({ _id: req.params.photoId}, function (err, photo) {
            res.json({ photo: photo});
        });
    },

    comments: function (req, res, next) {
        if (!req.params.photoId) {
            res.send(404);
            return;
        }
        console.log('User wants to get comments of photo %s', req.params.photoId);
        Photo.findOne({ _id: req.params.photoId}).populate('comments.user').exec(function (err, photo) {
            if (!photo) {
                res.send(404);
                return;
            }
            res.json({ list: photo.comments});
        });
    }

};