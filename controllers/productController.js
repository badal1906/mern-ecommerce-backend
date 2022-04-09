const productModel = require("../models/productModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apifeatures");

//create product -- admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.create(req.body);

  res.status(201).json({
    product,
  });
});

//get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await productModel.countDocuments()

  const apiFeature = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
  //req.query.keyword kuch keyword hum jab search krne ko bolte h wo h
  const products = await apiFeature.query;
  /*hum keyword find me islie pass nhi krrhe kyuki wo direct match dedega word ka 
  matlab agr search kia h samosa matlab hum wo sare words chahie jinme samosa aaye 
  ab samosa unke aage aaye ya piche aaye but usko contain krne wale sare result dedeo

  but agr model.find({name:samosa }) krte hai to wo sirf samosa word dega usko koi contain krne wala result nhi
  eg ye hume samosamosa nhi dega sirf samosa dega
  */

  res.status(200).json({
    success: true,
    products,
    productCount
  });
});

//update product -- admin
exports.updateProduct = catchAsyncErrors(async (req, res) => {
  let product = await productModel.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "product not found",
    });
  }

  product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//delete product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "product not found",
    });
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});

//get single product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
