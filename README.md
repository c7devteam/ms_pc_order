# post card ordering micro server #

### running the server in dev mode ###

    NODE_ENV=development DEBUG=ms_pc_order:* ./bin/www

or with nodemon

    npm install nodemon -g
    NODE_ENV=development DEBUG=ms_pc_order:* nodemon ./bin/www

### Installation ###

    npm install
    npm install -g db-migrate

### migrating ###

    db-migrate up --config config/database.json


# Testing #

install mocha

    npm install mocha -g

**running the tests**

    npm test

# API #

### creating an order ###

    POST /api/v1/orders

**params**

 * delivery[address_line_1] - string
 * delivery[address_line_2] - string
 * delivery[zip] - string
 * delivery[country] - string
 * delivery[city] - string
 * billing[address_line_1] - string
 * billing[address_line_2] - string
 * billing[zip] - string
 * billing[country] - string
 * billing[city] - string
 * source_image_file - MULTIPART file
 * body_back - text



# nice to know #

### creating a migration ###

    db-migrate create <NAME> --config config/database.json
