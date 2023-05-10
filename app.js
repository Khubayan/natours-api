// All Express config should in app.js file (just a convention, but yeah you do)

const express = require('express');
const morgan = require('morgan'); // Morgan is a third-party middleware used to log requests to the console. For further information, refer to the documentation.

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
console.log('App running in', process.env.NODE_ENV, 'environment');
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// This middleware below will be applied to all endpoints since we don't specify any endpoint. Btw, our routes also a middleware but for certain endpoint.
app.use((req, res, next) => {
  console.log('Hallo from the middleware');
  next(); // The next function is used to continue the request/response cycle or execute the next middleware in the stack. If you don't call it, the cycle will be stuck forever at this point, and the server will never be able to return a response for the client's request.
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
