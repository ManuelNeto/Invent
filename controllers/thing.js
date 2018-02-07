var express = require('express');
var router = express.Router();


var Thing = require("../models/thing");
var fs = require('fs');
var path = require('path');

var auth = require('./auth');

router.post('/thing', auth.getAuth(), function (req, res) {

    var thing = new Thing(req.body);
        thing.save(function (err, next) {
          	if (err) {
            	return next(err);
           	}
          res.end()
     	});

});

router.get('/things', auth.getAuth(), function (req, res) {
    Thing.find(function (err, thing) {
            if (err) return console.error(err);
            res.send(thing);
        });
});

router.post('/thingsInRoom', auth.getAuth(), function (req, res) {

    var roomID = req.body.room;
        Thing.find({room: roomID} , function (err, thing) {
            if (err) return console.error(err);
            res.send(thing);
        });

});


// :thing = id
router.get('/thing/:thing', auth.getAuth(), function(req, res, next) {

  var thing = req.thing;

  Thing.find(function(err, thing) {
    if (err) {
      res.sendStatus(404);
      return next(err);
    }
      var r = res.send(thing);
      return next();
  });
});

/**
 * Edit Thing
 */

router.put('/thing/:id', auth.getAuth(), function (req, res) {
  Thing.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function (err, doc) {
      if (err) console.log(err);
      console.log("Objeto atualizado!");
      res.send(doc);
    });
});

router.delete('/thing/:thing', auth.getAuth(), function(req, res, next) {

  Thing.remove({_id: req.params.thing}, function(err) {
    if (err) {
      res.sendStatus(404);

       return next(err);
    }
    res.end();

    return next();
  });

});


router.param('thing', auth.getAuth(), function (req, res, next, _id) {
  var query = Thing.findById(_id);

  query.exec(function (err, thing) {
    if (err) {
      res.sendStatus(code404);
      return next(err);
    }
    if (!thing) {
      res.sendStatus(code404);
      return next(new Error('can\'t find thing'));
    }

    req.thing = thing;
    return next();
  });
});



module.exports = router;
