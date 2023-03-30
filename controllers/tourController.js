// const fs = require('fs');
const Tour = require('../models/tourModel');

exports.checkBodyMiddleware = (req, res, next) => {
  if (!req.body.name && !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    // result: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  // const id = req.params.id * 1; //a trick to convert string into number
  // const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    // data: {
    //   tour,
    // },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  res.status(201).json({
    status: 'succes',
    // data: newTour,
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Updated',
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).send(null);
};
