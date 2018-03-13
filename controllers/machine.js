var express = require('express');
var router = express.Router();
var csv = require('fast-csv');
var archiver = require('archiver')
var Machine = require('../models/machine');
var fs = require('fs');
var path = require('path');
var User = require("../models/user");
var auth = require('./auth');

//parte da foto
var multer  = require('multer')
var upload = multer({dest: './public/uploads/machinesImages/'})

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

router.post('/machine', upload.any(), auth.getAuth(), auth.checkRole, function (req, res) {

  var filename = '';
  var machine = new Machine(req.body);

  if (req.files) {
      req.files.forEach(function (file) {
      filename = (new Date).valueOf() + "-" + file.originalname
      fs.rename(file.path, 'public/uploads/machinesImages/' + filename, function (err) {
        if (err) console.log(err);
        console.log("file update...");
      })
    })
  }


    machine.image = filename;
        machine.save(function (err, next) {
          	if (err) {
            	return next(err);
           	}
          res.end()
     	});

});

router.post('/machinesInRoom', auth.getAuth(), auth.checkRole, function (req, res) {
        var roomID = req.body.room;
        Machine.find({room: roomID}, function (err, machine) {
            if (err) return console.error(err);
            res.send(machine);
        });
});

router.get('/machines', auth.getAuth(), function (req, res) {

    Machine.find(function (err, machine) {
        if (err) return console.error(err);
        res.send(machine);
    });

});

// :machine = id
router.get('/machine/:machine', auth.getAuth(), function(req, res, next) {

    console.log(req.params.machine);
    var machine = req.machine;

    Machine.findOne({_id: req.params.machine}, function(err, machine) {
        if (err) {
            res.sendStatus(404);
            return next(err);
        }
        var r = res.send(machine);

        return next();
    });

});

/**
 * Edit Machine
 */

router.put('/machine/:id', upload.any(), auth.getAuth(), auth.checkRole, function (req, res) {

  var filename = '';
  var machine = new Machine(req.body);

  if (req.files) {
      req.files.forEach(function (file) {
        filename = (new Date).valueOf() + "-" + file.originalname
        fs.rename(file.path, 'public/uploads/machinesImages/' + filename, function (err) {
          if (err) console.log(err);
          console.log("file update...");
        })
      })
    }

    if (filename != '') {
      machine.image = filename;
    }

    Machine.findOneAndUpdate({_id: req.params.id}, machine, {new: true}, function (err, doc) {
        if (err) console.log(err);
        console.log("Objeto atualizado!");
        res.send(doc);
    });
});

router.delete('/machine/:machine', auth.getAuth(), auth.checkRole, function(req, res, next) {

    Machine.remove({_id: req.params.machine}, function(err) {
        if (err) {
            res.sendStatus(404);

            return next(err);
        }
        res.end();

        return next();
    });

});

router.get('/machines/attachments', function (req, res) {

    Machine.find({}, function (err, machines) {
        if (err) return console.log(err);

        var things = [['Sala','Descrição', 'IP público', 'Usuário', 'Processador', 'HD', 'Memória RAM',
                    'Patrimônio', 'Patrimônio inst', 'Monitor', 'Patrimonio (Monitor)', 'Patrimonio inst(Monitor)',
                    'Data de Aquisição','Situação','Destinatário']];

        for (var i = 0; i < machines.length; i++) {
            machine = [machines[i].room, machines[i].description, machines[i].public_ip, machines[i].machine_user,
                       machines[i].processor,  machines[i].hd, machines[i].ram_memory, machines[i].number_Patrimony,
                       machines[i].inst_Patrimony, machines[i].monitor, machines[i].inst_monitor_Patrimony,
                       machines[i].monitor_number_Patrimony, machines[i].acquisition_date, machines[i].situation, machines[i].destination];
            things.push(machine);
        }

        var ws = fs.createWriteStream('relatorioMaquinas.csv');

        csv.
            write(things, {headers: true})
            .pipe(ws);

    });

    res.send('Sucesso');

});


router.param('machine', auth.getAuth(), function (req, res, next, _id) {
    var query = Machine.findById(_id);

    query.exec(function (err, machine) {
        if (err) {
            res.sendStatus(code404);
            return next(err);
        }
        if (!machine) {
            res.sendStatus(code404);
            return next(new Error('can\'t find machine'));
        }

        req.machine = machine;
        return next();
    });
});



module.exports = router;
