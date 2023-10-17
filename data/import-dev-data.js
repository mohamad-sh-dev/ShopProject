const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Products = require('../model/products');
const User = require('../model/users');
const Review = require('../model/reviews');

dotenv.config({
    path: "./config/config.env"
})
const DB = process.env.DATABASE_URI
mongoose
  .connect("mongodb://127.0.0.1:27017/shopnex", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
// )
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
)
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// )

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    // await User.create(users);
    await Products.create(products);
    // await Review.create(users);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    // await User.deleteMany();
    await Products.deleteMany();
    // await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}