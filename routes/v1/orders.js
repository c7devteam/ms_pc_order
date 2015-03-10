var config = require('../../config/'+ (process.env.NODE_ENV || 'development') +'.json');
var express = require('express');
var router = express.Router();
var util = require('util');
var sql = require('sql-bricks');
var Busboy = require('busboy');
var inspect = require('util').inspect;
var crypto = require('crypto');
var Knox = require('knox');
var moment = require('moment');
var validator = require('validator');


Knox.aws = Knox.createClient({
  key: config.aws.AWS_ACCESS_KEY_ID,
  secret: config.aws.AWS_SECRET_ACCESS_KEY,
  bucket: config.aws.S3_BUCKET_NAME,
  region: 'eu-west-1'
});


/* GET users listing. */
router.post('/', function(req, res, next) {
  req.files = [];
  req.fields = [];

  var busboy = new Busboy({ headers: req.headers });

  // storing incomming form fields
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      req.fields[fieldname] = val;
    });

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

    file.fileRead = [];

    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

    file.on('data', function(data) {
      this.fileRead.push(data);
    });

    file.on('end', function() {
      var finalBuffer = Buffer.concat(this.fileRead);

        // Generate date based folder prefix
        var datePrefix = moment().format('YYYY[/]MM');
        var key = crypto.randomBytes(10).toString('hex');
        var hashFilename = key + '-' + filename;

        var path_to_upload = '/uploads/' + datePrefix + '/' + hashFilename;

        req.files[fieldname] = {
          buffer: finalBuffer,
          size: finalBuffer.length,
          filename: filename,
          mimetype: mimetype,
          path_to_upload: path_to_upload
        };

        var headers = {
          'Content-Length': req.files[fieldname].size,
          'Content-Type': req.files[fieldname].mimetype,
          'x-amz-acl': 'public-read'
        };

        Knox.aws.putBuffer( req.files[fieldname].buffer, path_to_upload, headers, function(err, response){
          if (err) {
            console.error('error streaming image: ', new Date(), err);
            return next(err);
          }
          if (response.statusCode !== 200) {
            console.error('error streaming image: ', new Date(), err);
            return next(err);
          }

          console.log('Amazon response statusCode: ', response.statusCode);
        });

    });
  });

  // finishing the upload
  busboy.on('finish', function() {
    var errors = [];

    // validation
    if(validator.isNull(req.fields['delivery_address_line_1'])){
      errors.push("delivery_address_line_1 missing");
    }
    if(validator.isNull(req.fields['delivery_address_line_2'])){
      errors.push("delivery_address_line_2 missing");
    }
    if(validator.isNull(req.fields['delivery_address_city'])){
      errors.push("delivery_address_city missing");
    }
    if(validator.isNull(req.fields['delivery_address_zip'])){
      errors.push("delivery_zip missing");
    }
    if(validator.isNull(req.fields['delivery_address_country'])){
      errors.push("delivery_country missing");
    }
    if(validator.isNull(req.fields['billing_address_line_1'])){
      errors.push("billing_address_line_1 missing");
    }
    if(validator.isNull(req.fields['billing_address_line_2'])){
      errors.push("billing_address_line_2 missing");
    }
    if(validator.isNull(req.fields['billing_address_city'])){
      errors.push("billing_address_city missing");
    }
    if(validator.isNull(req.fields['billing_address_zip'])){
      errors.push("billing_address_zip missing");
    }
    if(validator.isNull(req.fields['billing_address_country'])){
      errors.push("billing_address_country missing");
    }
    if(validator.isNull(req.fields['body_back'])){
      errors.push("body_back missing");
    }
    if(validator.isNull(req.fields['email'])){
      errors.push("email missing");
    }
    if(validator.isNull(req.files['source_image_file'])){
      errors.push("source_image_file missing");
    }

    if(errors.length > 0){ // if there are errors, sent it
      res.status(400).send('There have been validation errors: ' + util.inspect(errors));
      console.log("finishing...");
      return
    }else{
      console.log("WTF");
      // building the insert statement
      var insert_stmnt = sql.insert('post_card_orders', {
          'delivery_address_line_1': req.fields['delivery_address_line_1'],
          'delivery_address_line_2': req.fields['delivery_address_line_2'],
          'delivery_address_city': req.fields['delivery_address_city'],
          'delivery_address_zip': req.fields['delivery_address_zip'],
          'delivery_address_country': req.fields['delivery_address_country'],
          'billing_address_line_1': req.fields['billing_address_line_1'],
          'billing_address_line_2': req.fields['billing_address_line_2'],
          'billing_address_city': req.fields['billing_address_city'],
          'billing_address_zip': req.fields['billing_address_zip'],
          'billing_address_country': req.fields['billing_address_country'],
          'body_back': req.fields['body_back'],
          'email': req.fields['email'],
          'source_image_file': req.files['source_image_file']['path_to_upload'],
          'order_state':0,
          'delivery_state':0
          }
        ).toString();
        console.log(insert_stmnt);

        // creating the database entry
        req.getConnection(function(err, connection) {
          console.log(insert_stmnt);
          var query = connection.query(insert_stmnt, function(err, result) {
            if (err) { throw err; }
            res.send({order_id: result.InsertId, code: 100})
          });
        });
    }

  });
  req.pipe(busboy);

});

module.exports = router;
