var express = require('express');
var router = express.Router();
var csv = require('fast-csv');
var archiver = require('archiver')
var Thing = require("../models/thing");
var fs = require('fs');
var path = require('path');
var auth = require('./auth');

//parte da foto
var multer  = require('multer')
var upload = multer({dest: './public/uploads/thingsImages/'})

// var upload = multer({ storage: storage })
///////////////////////////////////////////

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// });


router.post('/thing', upload.any(), auth.getAuth(), auth.checkRole, function (req, res, next) {

  var filename = '';
  var thing = new Thing(req.body);

  if (req.files) {
      req.files.forEach(function (file) {
      filename = (new Date).valueOf() + "-" + file.originalname
      fs.rename(file.path, 'public/uploads/thingsImages/' + filename, function (err) {
        if (err) console.log(err);
        console.log("file update...");
      })
    })
  }

    thing.image = filename;
    thing.save(function (err, next) {
          	if (err) {
            	return next(err);
           	}
            res.end();
     	});
});


router.get('/things/attachments', function (req, res) {

    Thing.find({}, function (err, things) {
        if (err) return console.error(err);

        var list = [['Sala','Patrimônio', 'Série', 'Origem', 'Descrição', 'Marca/Modelo', 'Data de aquisição',
                    'Situação', 'Destinatário', 'Observações']];

        for (var i = 0; i < things.length; i++) {
            thing = [things[i].room, things[i].number_Patrimony, things[i].serie, things[i].origem,
                       things[i].description,  things[i].brand_model, things[i].acquisition_date, things[i].situation,
                       things[i].destination, things[i].comments];
            list.push(thing);
        }

        var ws = fs.createWriteStream(__dirname + '/relatorioObjetos.csv');

        csv.
            write(list, {headers: true})
            .pipe(ws);

    });

    res.download(__dirname + '/relatorioObjetos.csv', 'relatorioObjetos.csv');

});

router.get('/things', auth.getAuth(), function (req, res) {
    Thing.find(function (err, thing) {
            if (err) return console.error(err);
            res.send(thing);
        });
});

router.post('/thingsInRoom', auth.getAuth(), auth.checkRole, function (req, res) {

    var roomID = req.body.room;
        Thing.find({room: roomID} , function (err, thing) {
            if (err) return console.error(err);
            res.send(thing);
        });

});


// :thing = id
router.get('/thing/:thing', auth.getAuth(), function(req, res, next) {

  var thing = req.thing;

  Thing.findOne({_id: req.params.thing}, function(err, thing) {
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

router.put('/thing/:id', upload.any(), auth.getAuth(), auth.checkRole, function (req, res) {

  var filename = '';
  var thing = new Thing(req.body);

  if (req.files) {
      req.files.forEach(function (file) {
        filename = (new Date).valueOf() + "-" + file.originalname
        fs.rename(file.path, 'public/uploads/thingsImages/' + filename, function (err) {
          if (err) console.log(err);
          console.log("file update...");
        })
      })
    }

  if (filename != '') {
    thing.image = filename;
  }

  Thing.findOneAndUpdate({_id: req.params.id}, thing, {new: true}, function (err, doc) {
      if (err) res.sendStatus(404);
      console.log("Objeto atualizado!");
      res.send(doc);
    });
});

router.delete('/thing/:thing', auth.getAuth(), auth.checkRole, function(req, res, next) {

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
