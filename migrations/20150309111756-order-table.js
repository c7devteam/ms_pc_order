var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('post_card_orders', {
    id: { type: 'int', primaryKey: true },
    delivery_address_line_1: 'text',
    delivery_address_line_2: 'text',
    delivery_address_city: 'text',
    delivery_address_zip: 'text',
    delivery_address_country: 'text',
    billing_address_line_1: 'text',
    billing_address_line_2: 'text',
    billing_address_city: 'text',
    billing_address_zip: 'text',
    billing_address_country: 'text',
    tax: 'int',
    total_price_netto: 'int',
    total_price_brutto: 'int',
    order_state: 'int',
    delivery_state: 'int',
    created_at: 'datetime',
    delivered_at: 'datetime',
    back_file: "string",
    cover_file: "string",
    billing_file: "string",
    source_image_file: "string",
    body_back: "text"

  }, callback);
};

exports.down = function(db, callback) {
  callback();
};
