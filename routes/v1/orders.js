var express = require('express');
var router = express.Router();
var util = require('util');
var sql = require('sql-bricks');

/* GET users listing. */
router.post('/', function(req, res, next) {
  // validations
  req.checkBody('delivery[address_line_1]', 'Invalid delivery[address_line_1]').notEmpty();
  req.checkBody('delivery[address_line_2]', 'Invalid delivery[address_line_2]').notEmpty();
  req.checkBody('delivery[zip]', 'Invalid delivery[zip]').notEmpty();
  req.checkBody('delivery[country]', 'Invalid delivery[country]').notEmpty();
  req.checkBody('delivery[city]', 'Invalid delivery[city]').notEmpty();

  req.checkBody('billing[address_line_1]', 'Invalid billing[address_line_1]').notEmpty();
  req.checkBody('billing[address_line_2]', 'Invalid billing[address_line_2]').notEmpty();
  req.checkBody('billing[zip]', 'Invalid billing[zip]').notEmpty();
  req.checkBody('billing[country]', 'Invalid billing[country]').notEmpty();
  req.checkBody('billing[city]', 'Invalid billing[city]').notEmpty();

  req.checkBody('source_image_file', 'Invalid source image file').notEmpty();
  req.checkBody('body_back', 'Invalid body back').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.status(400).send('There have been validation errors: ' + util.inspect(errors));
    return;
  }


  var insert_stmnt = sql.insert('orders', {
      'delivery_address_line_1': req.param("delivery[address_line_1]")
      }
    ).toString();

  res.send(insert_stmnt);
});

module.exports = router;
