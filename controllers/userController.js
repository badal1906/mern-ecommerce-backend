const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const userModel = require("../models/userModel");
 const bcrypt = require('bcryptjs')
const sendToken = require('../utils/jwtToken')

 //create a user
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await userModel.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample id",
      url: "profile pic url",
    },
  });


  await user.save()//save likhe bina hashed password ki jagah normal string me store horha tha password
  sendToken(user,201,res)
 
});

//login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    // console.log(password);

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await userModel.findOne({ email }).select("+password");

//   console.log(password,user);
  if (!user) {
    return next(new ErrorHandler("Invalid email or password-1", 401));
  }
  const isPasswordMatched = await bcrypt.compare(password,user.password);
  console.log(password,user.password);
  console.log(isPasswordMatched)
  if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password-2", 401));
    }

  sendToken(user,200,res)
});
