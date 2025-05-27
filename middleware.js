const Listing = require('./models/Listing.js')
const ExpressError= require("./utils/ExpressError.js")
const {FormSchema, ReviewSchema} = require('./validation.js')
const Review = require('./models/Review.js')
module.exports.isLogedin = (req, res, next) =>{
 console.log(req.originalUrl)
    if(!req.isAuthenticated()){
        let redirectUrl = req.originalUrl;
        req.session.redirectUrl = redirectUrl;
      return res.redirect('/login')
    } 
next()
}


module.exports.saveRedirectUrl = (req, res, next) => {
res.locals.redirectUrl = req.session.redirectUrl || '/listings'
next()
}


module.exports.isOwner = async(req,res,next) =>{
  let {id} = req.params;
  let list= await Listing.findById(id)
if(!list.owner._id.equals(res.locals.currentUser._id)){
req.flash('error', 'You are not authorized')
return res.redirect(`/listings/${id}`)
}
next()
}


module.exports.vlidateFormSchema = (req, res, next) =>{
    const {error} = FormSchema.validate(req.body)
console.log("validate")
    if(error){
        throw new ExpressError(400, error.details[0].message)
    }else{
        next()
    }
}

module.exports.ReviewValidateSchema = (req, res, next) => {

    const {error} = ReviewSchema.validate(req.body);
   
    if(error) {
        console.log("f")
     throw new ExpressError(400, "something missing in comment")
    }
    console.log("validate review schema")
    next()
}

module.exports.isReviewAuthor = async(req, res, next) =>{
        let {id, reviewId} = req.params;
console.log("k")
        let review = await Review.findById(reviewId);
        if(!review.author._id.equals(req.user._id)){
req.flash('error', 'You r not author')
            return res.redirect(`/listings/${id}`)
        }
        next()
}