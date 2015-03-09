var config = require('../config/'+ (process.env.NODE_ENV || 'development') +'.json');
var express = require('express');
var router = express.Router();
var util = require('util');
var sql = require('sql-bricks');
var Busboy = require('busboy');
var inspect = require('util').inspect;
var crypto = require('crypto');
var Knox = require('knox');


Knox.aws = Knox.createClient({
  key: config.aws.AWS_ACCESS_KEY_ID,
  secret: config.aws.AWS_SECRET_ACCESS_KEY,
  bucket: config.aws.S3_BUCKET_NAME,
  region: 'eu-west-1'
});


/* GET users listing. */
router.post('/', function(req, res, next) {
  req.files[];

  var busboy = new Busboy({ headers: req.headers });

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
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

  busboy.on('finish', function() {
    res.send("Hallo!");
  });
  req.pipe(busboy);

  /*
  var insert_stmnt = sql.insert('orders', {
      'delivery_address_line_1': req.param("delivery[address_line_1]")
      }
    ).toString();

  res.send(insert_stmnt);*/
});

module.exports = router;
