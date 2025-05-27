const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
// const ExpressError = require("../utils/ExpressError.js")
 const {ReviewValidateSchema, isLogedin,isReviewAuthor} = require("../middleware.js")
const reviewController = require('../controllers/reviewController.js')


//error after login from dlete review path uri
let setUrl = (req,res,next)=>{
    let {id} = req.params
    req.originalUrl = `listings/${id}`
    next()
}

//create a review
router.post("/",isLogedin,ReviewValidateSchema,wrapAsync( reviewController.createReview))


//delete review 
router.delete("/:reviewId",setUrl,isLogedin,isReviewAuthor, wrapAsync( reviewController.destroyReview))


module.exports = router;