// All Express config should in app.js file (just a convention, but yeah you do)

const express = require('express');
const morgan = require('morgan'); // Morgan is a third-party middleware used to log requests to the console. For further information, refer to the documentation.

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
console.log('App running in', process.env.NODE_ENV, 'environment');
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json()); // Because out of the box, Express does not include body data in the request object. Therefore, to make data available on the request, we run this middleware.
app.use(express.static(`${__dirname}/public`)); // This is used to serve static files. Use the URL 'https://domain/filename.html'. We don't need to add the 'public' directory to the URL because, by default, Express will look for files in the 'public' folder.

// This middleware below will be applied to all endpoints since we haven't specified any endpoint. By the way, our routes also act as middleware, but only for certain endpoints.
app.use((req, res, next) => {
  console.log('Hallo from the middleware');
  next(); // The next function is used to continue the request/response cycle or execute the next middleware in the stack. If you don't call it, the cycle will be stuck forever at this point, and the server will never be able to return a response for the client's request.
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`A Request recieved at ${req.requestTime}`);
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter); // This is where we mount the specific route. Any request that refers to 'http://domain/api/v1/tours/' will be directed to the tourRouter. Depending on the method and request, the specific router will be called to process the request. In the route folder, you can check which HTTP methods the tourRoute supports.
app.use('/api/v1/users', userRouter);

module.exports = app;
