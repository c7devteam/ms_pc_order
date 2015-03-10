var config = require('../../config/'+ (process.env.NODE_ENV || 'development') +'.json');
var express = require('express');
var router = express.Router();
var sql = require('sql-bricks');
var util = require('util');
var jwt = require('jsonwebtoken');

router.post('/', function(req, res, next) {
  req.checkBody('email', 'Invalid email').isEmail();
  req.checkBody('password', 'Invalid password').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.status(400).send('There have been validation errors: ' + util.inspect(errors));
    return;
  }

  req.getConnection(function(err, connection) {
    var select = require('sql-bricks').select;
    var sql_query = select().from('users').where({email: req.body.email}).toString();
    connection.query(sql_query, [], function(err, results) {
        if (err) return next(err);

        if(results.length > 0){
          var response = {type: false ,data: "email already taken"};
          res.status(400).send(response);
          return;
        }else{
          var token = jwt.sign(req.body['email'], config.jwt.SECRETS);
          var insert_stmnt = sql.insert('users', {
              'email': req.body['email'],
              'password': req.body['password'],
              'token': token,
              }
            ).toString();

            connection.query(insert_stmnt, [], function(err, results) {
              if (err) return next(err);

              var response = {type: true,token: token,data: {email: req.body.email}};
              res.send(response);
            });
        }

      });
  });
});

module.exports = router;
