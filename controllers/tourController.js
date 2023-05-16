// const fs = require('fs');
const Tour = require('../models/tourModel');

// Middleware for 'top-5-best-prices' to manipulate th query parameter.
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //NOTE:
    // *req.query* is used to get query strings from a URL. Basically, it is used to allow users to filter the incoming response from an API server using the URL.
    // The *excludedFields* array is used to avoid miscommunication when filtering data using query parameters through a URL. For example, instead of using the keyword "page" as a query parameter in the URL, it can be used in the browser for pagination.

    // BUILD QUERY
    // 1A) Filtering
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);
    // console.log(req.query);

    // 1B) Advance filtering
    let queryStr = JSON.stringify(queryObj); // Converting the *queryObj* into a string allows us to manipulate it as a string.
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // Here we match the *queryStr* with the regex we have defined, using keywords in MongoDB, and return it back *with the "$" sign so MongoDB knows it is an operator used for filtering data*.

    // console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr)); // Tour.find() will return a query, allowing you to chain methods to it.

    // 2 Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' '); //In the URL, we split the query parameter. For example, from "price,createdAt" into "price createdAt" so that we can use it as a sort parameter on Mongoose's methods like sort().
      // "When *sorting*, the *'-'* sign is used for *descending sorting*.
      query = query.sort(sortBy);
      // console.log(sortBy);
    } else {
      query = query.sort('price');
    }

    // 3 Fields
    if (req.query.fields) {
      // console.log(req.query.fields);
      const fields = req.query.fields.split(',').join(' ');
      // console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // But when using the *'select' method*, the *'-' sign is used for excluding*.
    }

    // 4. Pagination
    // skip() & limit() used methods
    const page = req.query.page * 1 || 1;
    // console.log(typeof page, ' = ', page);
    const limit = req.query.limit * 1 || 100;
    // console.log(typeof limit);
    const skip = (page - 1) * limit;
    // console.log(page, skip);

    query = query.skip(skip).limit(limit);

    // EXECUTE QUERY
    const tours = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'succes',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
    console.log(err);
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      messege: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      messege: err,
    });
  }
};
