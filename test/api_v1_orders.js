var request = require('supertest');
var faker = require('faker');

request = request('http://localhost:3000');

describe('creating a post card order placement', function() {

  it('should fail because not all data is provided', function(done) {
    request.post('/api/v1/orders')
    .field("delivery_address_line_1",faker.name.firstName() + " " + faker.name.lastName())
    .expect(400, done)
  });

  it("should succeed",function(done){
    request.post('/api/v1/orders')
    .attach('source_image_file','test/fixtures/postcard_front.jpg')
    .field("delivery_address_line_1",faker.name.firstName() + " " + faker.name.lastName())
    .field("delivery_address_line_2",faker.address.streetName() + " " + faker.address.streetAddress())
    .field("delivery_address_city",faker.address.city())
    .field("delivery_address_zip",faker.address.zipCode())
    .field("delivery_address_country",faker.address.country())
    .field("billing_address_line_1",faker.name.firstName() + " " + faker.name.lastName())
    .field("billing_address_line_2",faker.address.streetName() + " " + faker.address.streetAddress())
    .field("billing_address_city",faker.address.city())
    .field("billing_address_zip",faker.address.zipCode())
    .field("billing_address_country",faker.address.country())
    .field("body_back",faker.lorem.paragraph())
    .field("email",faker.internet.email())
    .expect(200,done)
  });
});
