class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj); // Converting the *queryObj* into a string allows us to manipulate it as a string.
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); //In the URL, we split the query parameter. For example, from "price,createdAt" into "price createdAt" so that we can use it as a sort parameter on Mongoose's methods like sort().
      // "When *sorting*, the *'-'* sign is used for *descending sorting*.
      this.query = this.query.sort(sortBy);
      // console.log(sortBy);
    } else {
      this.query = this.query.sort('price');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // console.log(req.query.fields);
      const fields = this.queryString.fields.split(',').join(' ');
      // console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // But when using the *'select' method*, the *'-' sign is used for excluding*.
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    // console.log(typeof page, ' = ', page);
    const limit = this.queryString.limit * 1 || 100;
    // console.log(typeof limit);
    const skip = (page - 1) * limit;
    // console.log(page, skip);

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
