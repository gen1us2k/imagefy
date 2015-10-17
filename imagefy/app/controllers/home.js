var express = require('express'),
    router = express.Router(),
    db = null;

module.exports = function (app, createClient) {
    app.use('/', router);
    db = createClient();
};

router.get('/', function (req, res, next) {
    db.ping(function (err, rslt) {
        if (err) {
            throw new Error(err);
        } else {
            res.render('index', {
                title: 'I am use Riak! I am samurai!',
                pingResponse: rslt
            });
        }
    })
});
