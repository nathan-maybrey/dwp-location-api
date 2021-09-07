
# DWP Tech Test

An API built with Node.js and Express which calls the API https://bpdts-test-app.herokuapp.com, and returns people who are either living in London, or whose coordinates are within 50 miles of London.

## Prerequisites

To run this project you will need:

- [Node.js](https://nodejs.org/en/) (Tested with Node.js v12/14/16)

## Install

- Fork and clone the repository onto your local machine.
- Install dependencies

```bash
npm ci
```

## Environment Variables

**The below environmental variables all have default values. You do not need to set them to run the application.**

| Variable               | Default Value                         |
| ---------------------- | ------------------------------------- |
| PORT                   | 3000                                  |
| LOG_LEVEL              | info                                  |
| USER_LOOKUP_ENDPOINT   | https://bpdts-test-app.herokuapp.com    |

## Running

(**The applicaton will start on port 3000 by default**)

```bash
npm start
```

## Endpoints

There is one endpoint available to use:

> /users/{city}

**{city} is a required parameter**

e.g. (working example, default search radius is 50 miles):
```
http://localhost:3000/users/London
```

(customised distance, returns within 10 miles of London):
```
http://localhost:3000/users/London?radius=10
```

## Testing

Tests have been written using [Mocha](https://www.npmjs.com/package/mocha) and [Chai](https://www.npmjs.com/package/chai).

To run tests:

```bash
npm test
```

To run test coverage report:

```bash
npm run test:coverage
```

## Swagger

You can access the swagger documentation by going to the following address after starting the app on port 3000:

```bash
http://localhost:3000/docs
```

## Linting

This project has been linted using the [Airbnb base](https://www.npmjs.com/package/eslint-config-airbnb-base) configuration.

To run eslint for the project run:

```bash
npm run lint
```

## Docker

**You will need Docker installed on your machine to build and run with Docker**

To build the image with Docker run the following:

```bash
docker build -t dwp-location-api .
```

To start the built image:

```bash
docker run -d --name dwp-location-api -p 3000:3000 dwp-location-api
```

To stop the image:

```bash
docker stop dwp-location-api
```
