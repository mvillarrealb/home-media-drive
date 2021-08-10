# HOME-CENTER-API

## Description

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# sandbox mode
$ npm run start:sandbox

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


npm i --save compression
npm i -D @types/multer
npm install --save @nestjs/passport
npm install --save @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
npm i --save helmet
npm i --save @nestjs/throttler
npm install --save @nestjs/typeorm typeorm pg
npm i --save @nestjs/config

npm i --save js-yaml
npm i -D @types/js-yaml
npm i bcrypt
npm i -D @types/bcrypt

POST /accounts/@me/password --reset password
GET /accounts/@me --Get profile
POST /accounts/signin -- Login
POST /accounts/signup -- Register
POST /oauth/token -- Refresh access token

post /buckets --create bucket
get /buckets/:bucketId --get bucket By Id
post /buckets/:bucketId --upload File

post /buckets/:bucketId/:resourceId/shared share a file with another user
GET /buckets/:bucketId/:resourceId/shared List shared files

patch /buckets/:bucketId/:resourceId --Move file to a different buc