var config = require('../../config/'+ (process.env.NODE_ENV || 'development') +'.json');
var express = require('express');
var router = express.Router();
var sql = require('sql-bricks');

router.post('/', function(req, res, next) {
  req.getConnection(function(err, connection) {
    var select = require('sql-bricks').select;
    var sql_query = select().from('users').where({email: req.body.email,password: req.body.password}).toString();
    connection.query(sql_query, [], function(err, results) {
        if (err) return next(err);

        if(results.length > 0){
          response = {type: true,token: results[0].token,data: {email: results[0].email}}
          res.send(response);
        }else{
          res.status(404).send({type: false,data: "authorization failed"});
        }
      });
  });
});

module.exports = router;
