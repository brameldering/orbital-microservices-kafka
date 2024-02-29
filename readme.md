> eCommerce platform built with the MERN stack & Redux.

## Features

- Full featured shopping cart
- Product reviews and ratings
- Top products carousel
- Product pagination
- Product search feature
- User profile with orders
- Admin product management
- Admin user management
- Admin Order details page
- Mark orders as delivered option
- Checkout process (shipping, payment method, etc)
- PayPal / credit card integration
- Database seeder (products & users)

## Usage

- Create a MongoDB database and obtain your `MongoDB URI` - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Create a PayPal account and obtain your `Client ID` - [PayPal Developer](https://developer.paypal.com/)
- TO COMPLETE

### Env Variables

```
NODE_ENV = <development / test / production>
IMAGE_STORAGE_LOCATION = <serverdisk / cloudinary>
CORS_ALLOWED_ORIGINS = <array of allowed origins such as ['http://127.0.0.1:3000', 'http://localhost:3000']>
PORT = <development port (default is 5000)>

MONGO_URI = <mongo db uri>

REDIS_HOST = <redis db uri>
REDIS_PORT = <redis db port>
REDIS_PASSWORD = <redis db password>

JWT_SECRET = <your_secret>
EXPIRES_IN = <number of days in format '30d' for 30 days>
COOKIE_EXPIRES_TIME = <number of days in format 30 for 30 days>

PAYPAL_CLIENT_ID = <paypal client_id>
PAYPAL_APP_SECRET = <paypal secret>
PAYPAL_API_URL = https://api-m.sandbox.paypal.com

CLOUDINARY_CLOUD_NAME = <cloudinary cloud name>
CLOUDINARY_API_KEY =  <cloudinary api key>
CLOUDINARY_API_SECRET = <cloudinary api secret>
CLOUDINARY_SAMPLE_IMAGE_URL = <URL to default sample image on Cloudinary>

PRODUCTS_PER_PAGE = <max number of products per page>
DEFAULT_RESET_PASSWORD = <default password which is set during reset pasword function>

```

Prisma Client for Inventory Postgres Database
In inventory folder run "npx prisma generate" to generate the prisma client
